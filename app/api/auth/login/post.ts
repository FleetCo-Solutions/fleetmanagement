import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getUserPermissions } from "@/lib/rbac/utils";
import { AuthenticatedUser } from "@/lib/auth/types";
import bcrypt from "bcryptjs";

export async function loginUser(request: NextRequest) {
  const { username, password } = await request.json();
  if (!username || !password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 }
    );
  }

  try {
    const [user] = await db
      .select({
        id: users.id,
        companyId: users.companyId, // Add companyId to response
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        password: users.passwordHash,
        status: users.status,
      })
      .from(users)
      .where(eq(users.email, username))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Here you would normally verify the password with a hashed password stored in the database\
    if (!(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    await db
      .update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, user.id));

    // Fetch permissions and roles
    const authUser: AuthenticatedUser = {
      id: user.id,
      companyId: user.companyId || "",
      type: "user",
    };
    const { permissions, roles } = await getUserPermissions(authUser);

    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          ...user,
          permissions,
          role: roles || [], // Include the primary role
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
