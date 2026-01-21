import { db } from "@/app/db";
import { users, userRoles } from "@/app/db/schema";
import { sendUserCredentialsEmail } from "@/app/lib/mail";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { logAudit, sanitizeForAudit } from "@/lib/audit/logger";
import { notify } from "@/lib/notifications/notifier";

export interface IPostUser {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password?: string;
  status?: "active" | "inactive" | "suspended";
  roleIds?: string[];
}

export default async function postUser(
  companyId: string,
  body: IPostUser,
  actorId?: string
) {
  try {
    if (!body.firstName || !body.lastName || !body.email || !body.phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // const plainPassword = body.password || "Welcome@123";
    // const passwordToStore = plainPassword;

    const result = await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          firstName: body.firstName,
          lastName: body.lastName,
          phone: body.phone,
          email: body.email,
          passwordHash: await bcrypt.hash("Welcome@123", 12),
          companyId: companyId,
          status: body.status || "active",
        })
        .returning();

      if (body.roleIds && body.roleIds.length > 0) {
        await tx.insert(userRoles).values(
          body.roleIds.map((roleId) => ({
            userId: user.id,
            roleId: roleId,
          }))
        );
      }

      return user;
    });

    if (result) {
      await sendUserCredentialsEmail({
        to: result.email,
        username: result.email,
        password: "Welcome@123",
      });

      // Send welcome notification
      await notify({
        userId: result.id,
        actorType: "user",
        type: "system.welcome",
        title: "Welcome to FleetCo",
        message: "Your account has been created successfully. Welcome aboard!",
        link: "/profile",
        channels: ["in_app", "email"],
      });
    }

    // Log user creation
    if (actorId) {
      await logAudit({
        action: "user.created",
        entityType: "user",
        entityId: result.id,
        newValues: {
          ...sanitizeForAudit(result),
          roleIds: body.roleIds,
        },
        actorId,
        actorType: "user",
        companyId,
      });
    }

    return NextResponse.json(
      { message: `User Created Successfully`, dto: result },
      { status: 201 }
    );
  } catch (err: any) {
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
        message: "Failed to create user: " + (err as Error).message,
      },
      { status: 500 }
    );
  }
}
