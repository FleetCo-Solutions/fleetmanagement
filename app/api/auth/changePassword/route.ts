import { db } from "@/app/db";
import { passwordResetOtps, users } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { message: "Email and new password are required" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Check if there's a verified OTP for this email
    const verifiedOtp = await db.query.passwordResetOtps.findFirst({
      where: and(
        eq(passwordResetOtps.email, email),
        eq(passwordResetOtps.verified, true)
      ),
      orderBy: (otps, { desc }) => [desc(otps.createdAt)],
    });

    if (!verifiedOtp) {
      return NextResponse.json(
        { message: "No verified OTP found. Please verify your OTP first." },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Update password (storing as plain text as per user request)
    await db
      .update(users)
      .set({
        passwordHash: newPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    // Invalidate all OTPs for this email
    await db
      .delete(passwordResetOtps)
      .where(eq(passwordResetOtps.email, email));

    return NextResponse.json({
      message: "Password reset successfully",
      success: true,
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { message: "Failed to reset password. Please try again." },
      { status: 500 }
    );
  }
}
