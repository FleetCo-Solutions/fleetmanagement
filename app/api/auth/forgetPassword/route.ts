import { db } from "@/app/db";
import { passwordResetOtps, users, drivers } from "@/app/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, phone } = await request.json();

    if (!email && !phone) {
      return NextResponse.json(
        { message: "Email or Phone number is required" },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Set expiration to 3 minutes from now
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

    // --- DRIVER FLOW (Phone) ---
    if (phone) {
      const [driver] = await db
        .select()
        .from(drivers)
        .where(and(eq(drivers.phone, phone), isNull(drivers.deletedAt)))
        .limit(1);

      if (!driver) {
        return NextResponse.json(
          { message: "No driver account found with this phone number" },
          { status: 404 }
        );
      }

      // Save OTP to database
      await db.insert(passwordResetOtps).values({
        driverId: driver.id,
        phone: phone,
        otp: otp,
        expiresAt: expiresAt,
        verified: false,
      });

      // Return OTP in response (Dev Mode)
      return NextResponse.json({
        message: "OTP generated successfully",
        success: true,
        otp: otp, // Returning OTP for dev/testing as requested
      });
    }

    // --- COMPANY USER FLOW (Email) ---
    if (email) {
      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!user) {
        return NextResponse.json(
          { message: "No account found with this email address" },
          { status: 404 }
        );
      }

      // Save OTP to database
      await db.insert(passwordResetOtps).values({
        userId: user.id,
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
    }

    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("Forget password error:", error);
    return NextResponse.json(
      { message: "Failed to process request. Please try again." },
      { status: 500 }
    );
  }
}
