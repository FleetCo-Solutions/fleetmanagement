import { db } from "@/app/db";
import { systemUsers } from "@/app/db/schema";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function postAdminUser(request: NextRequest) {
  try {
    const body = await request.json();
    const date = new Date();
    const systemUser = await db
      .insert(systemUsers)
      .values({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        passwordHash: await bcrypt.hash(body.password, 12),
        phone: body.phone,
      })
      .returning();

    if (systemUser) {
      return NextResponse.json(
        {
          timestamp: date,
          success: true,
          message: "System user created successfully",
          systemUser,
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        {
          timestamp: date,
          success: false,
          message: "Failed to create system user",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        timestamp: new Date(),
        success: false,
        message: "Internal server error: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
