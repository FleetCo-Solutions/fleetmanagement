import { db } from "@/app/db";
import { passwordResetOtps } from "@/app/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Find the most recent OTP for this email
    const otpRecord = await db.query.passwordResetOtps.findFirst({
      where: and(
        eq(passwordResetOtps.email, email),
        eq(passwordResetOtps.otp, otp),
        eq(passwordResetOtps.verified, false),
        gt(passwordResetOtps.expiresAt, new Date())
      ),
      orderBy: (otps, { desc }) => [desc(otps.createdAt)],
    });

    if (!otpRecord) {
      return NextResponse.json(
        { message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Mark OTP as verified
    await db
      .update(passwordResetOtps)
      .set({ verified: true })
      .where(eq(passwordResetOtps.id, otpRecord.id));

    return NextResponse.json({
      message: "OTP verified successfully",
      success: true,
      email: email,
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { message: "Failed to verify OTP. Please try again." },
      { status: 500 }
    );
  }
}
