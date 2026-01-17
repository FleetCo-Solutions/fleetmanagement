import { db } from "@/app/db";
import { passwordResetOtps, systemUsers } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Check if system user exists
    const user = await db.query.systemUsers.findFirst({
      where: eq(systemUsers.email, email),
    });

    if (!user) {
      return NextResponse.json(
        { message: "No system account found with this email address" },
        { status: 404 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration to 3 minutes from now
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

    // Save OTP to database
    await db.insert(passwordResetOtps).values({
      systemUserId: user.id,
      email: email,
      otp: otp,
      expiresAt: expiresAt,
      verified: false,
    });

    // Send OTP via email
    const { sendOtpEmail } = await import("@/app/lib/mail");
    await sendOtpEmail({
      to: email,
      otp: otp,
      userName: `${user.firstName} ${user.lastName}`,
    });

    return NextResponse.json({
      message: "OTP sent successfully to your email",
      success: true,
    });
  } catch (error) {
    console.error("Forget password system user error:", error);
    return NextResponse.json(
      { message: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}
