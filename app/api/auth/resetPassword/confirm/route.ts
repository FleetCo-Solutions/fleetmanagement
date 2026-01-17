import { db } from "@/app/db";
import {
  passwordResetOtps,
  users,
  drivers,
  systemUsers,
} from "@/app/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { identifier, otp, newPassword } = await request.json();

    if (!identifier || !otp || !newPassword) {
      return NextResponse.json(
        {
          message:
            "Identifier (email/phone), OTP, and new password are required",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Find the verified OTP record
    // We check both email and phone columns against the identifier
    const otpRecord = await db.query.passwordResetOtps.findFirst({
      where: (otps, { or, and, eq, gt }) =>
        and(
          or(eq(otps.email, identifier), eq(otps.phone, identifier)),
          eq(otps.otp, otp),
          eq(otps.verified, true),
          gt(otps.expiresAt, new Date())
        ),
      orderBy: (otps, { desc }) => [desc(otps.createdAt)],
    });

    if (!otpRecord) {
      return NextResponse.json(
        { message: "Invalid or expired OTP session. Please verify OTP first." },
        { status: 400 }
      );
    }

    // Determine user type and update password
    if (otpRecord.driverId) {
      // Update Driver Password
      await db
        .update(drivers)
        .set({ passwordHash: newPassword })
        .where(eq(drivers.id, otpRecord.driverId));
    } else if (otpRecord.systemUserId) {
      // Update System User Password
      await db
        .update(systemUsers)
        .set({ passwordHash: newPassword })
        .where(eq(systemUsers.id, otpRecord.systemUserId));
    } else if (otpRecord.userId) {
      // Update Company User Password
      await db
        .update(users)
        .set({ passwordHash: newPassword })
        .where(eq(users.id, otpRecord.userId));
    } else {
      return NextResponse.json(
        { message: "Orphaned OTP record. Cannot identify user." },
        { status: 500 }
      );
    }

    // Delete the used OTP record (and potentially older ones for this user to clean up)
    await db
      .delete(passwordResetOtps)
      .where(eq(passwordResetOtps.id, otpRecord.id));

    return NextResponse.json({
      message: "Password updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Reset password confirm error:", error);
    return NextResponse.json(
      { message: "Failed to update password. Please try again." },
      { status: 500 }
    );
  }
}
