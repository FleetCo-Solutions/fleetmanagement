import { db } from "@/app/db";
import { systemUsers } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/lib/auth/jwt";
import bcrypt from "bcryptjs";

/**
 * Admin login request body
 */
interface AdminLoginRequest {
  email: string;
  password: string;
}

/**
 * Admin login response
 */
interface AdminLoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    department: string | null;
  };
  message?: string;
}

/**
 * Handle admin login with email and password
 *
 * @param request - Next.js request object
 * @returns JSON response with JWT token and admin profile
 */
export async function loginAdmin(
  request: NextRequest
): Promise<NextResponse<AdminLoginResponse>> {
  try {
    const body = (await request.json()) as AdminLoginRequest;

    // Validate input
    if (!body.email || !body.password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    // Query system user by email
    const userData = await db.query.systemUsers.findFirst({
      where: eq(systemUsers.email, body.email),
    });

    // Check if user exists
    if (!userData) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Check user status
    if (userData.status !== "active") {
      return NextResponse.json(
        {
          success: false,
          message: `Account is ${userData.status}. Please contact administrator.`,
        },
        { status: 403 }
      );
    }

    // Verify password
    // TODO: Implement proper password hashing (bcrypt) in future
    const isValidPassword = await bcrypt.compare(body.password, userData.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Update last login timestamp
    await db
      .update(systemUsers)
      .set({ lastLogin: new Date() })
      .where(eq(systemUsers.id, userData.id));

    // Generate JWT token
    const token = generateToken({
      id: userData.id,
      type: "systemUser",
      role: userData.role,
    });

    // Return success response with token and user profile
    return NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: userData.role,
          department: userData.department,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
