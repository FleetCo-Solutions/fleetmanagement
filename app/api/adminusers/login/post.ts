import { db } from "@/app/db";
import { systemUsers } from "@/app/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/lib/auth/jwt";
import bcrypt from "bcryptjs";

interface AdminLoginRequest {
  email: string;
  password: string;
}

interface AdminLoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string | null;
  };
  message?: string;
}

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
    const [userData] = await db
      .select()
      .from(systemUsers)
      .where(
        and(eq(systemUsers.email, body.email), isNull(systemUsers.deletedAt))
      )
      .limit(1);

    if (!userData) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    if (userData.status !== "active") {
      return NextResponse.json(
        {
          success: false,
          message: `Account is ${userData.status}. Please contact administrator.`,
        },
        { status: 403 }
      );
    }

    const isValidPassword = await bcrypt.compare(
      body.password,
      userData.passwordHash
    );

    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    await db
      .update(systemUsers)
      .set({ lastLogin: new Date() })
      .where(eq(systemUsers.id, userData.id));

    const token = generateToken({
      id: userData.id,
      type: "systemUser",
      role: userData.role,
    });

    return NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: userData.id,
          name: userData.firstName + " " + userData.lastName,
          email: userData.email,
          role: userData.role,
          department: userData.department,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error:" + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
