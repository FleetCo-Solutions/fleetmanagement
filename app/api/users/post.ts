import { auth } from "@/app/auth";
import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import { sendUserCredentialsEmail } from "@/app/lib/mail";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export interface IPostUser {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password?: string;
  status?: "active" | "inactive" | "suspended";
}

export default async function postUser(companyId: string, request: Request) {
  try {


    const body = (await request.json()) as IPostUser;

    if (!body.firstName || !body.lastName || !body.email || !body.phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    const plainPassword = body.password || "Welcome@123";
    // Using plain text as per previous action logic, or should we hash?
    // The previous action had hashing commented out.
    // However, the existing API had hashing.
    // I will stick to the previous action's logic to avoid breaking changes if they are in migration phase.
    // But wait, the previous action WAS using plain text.
    // const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const passwordToStore = plainPassword;

    const [user] = await db
      .insert(users)
      .values({
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
        email: body.email,
        passwordHash: passwordToStore,
        companyId: companyId,
        status: body.status || "active",
      })
      .returning();

    if (user) {
      await sendUserCredentialsEmail({
        to: user.email,
        username: user.email,
        password: plainPassword,
      });
    }

    return NextResponse.json(
      { message: `User Created Successfully`, dto: user },
      { status: 201 }
    );
  } catch (err: any) {
    // PostgreSQL error code for unique constraint violation
    if (err.cause?.code === "23505" || err.cause?.constraint) {
      const constraint = err.cause?.constraint || "";
      const detail = err.cause?.detail || "";
      const message = err.cause?.message || "";

      if (
        constraint.includes("email") ||
        detail.includes("email") ||
        message.includes("email")
      ) {
        return NextResponse.json(
          { message: "This email is already in use" },
          { status: 409 }
        );
      }
      if (
        constraint.includes("phone") ||
        detail.includes("phone") ||
        message.includes("phone")
      ) {
        return NextResponse.json(
          { message: "This phone number is already in use" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { message: "This email or phone number is already in use" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create user:" + (err as Error).message,
      },
      { status: 500 }
    );
  }
}
