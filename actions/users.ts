"use server";

import { IAddUser, ProfilePayload, IUsers, UserDetails } from "@/app/types";
import { auth } from "@/app/auth";
import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function getUsers(): Promise<IUsers> {
  try {
    const session = await auth();
    
    if (!session?.user?.companyId) {
      throw new Error("Unauthorized - No company assigned");
    }

    const usersList = await db.query.users.findMany({
      where: and(
        eq(users.companyId, session.user.companyId),
        isNull(users.deletedAt)
      ),
      orderBy: (users, { asc }) => [asc(users.firstName)],
    });

    return {
      timestamp: new Date(),
      statusCode: "200",
      message: "Users retrieved successfully",
      dto: {
        content: usersList,
        totalPages: 1,
        totalElements: usersList.length,
      },
    };
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function getUserDetails(id: string): Promise<UserDetails> {
  try {
    const session = await auth();
    
    if (!session?.user?.companyId) {
      throw new Error("Unauthorized - No company assigned");
    }

    const user = await db.query.users.findFirst({
      where: and(
        eq(users.id, id),
        eq(users.companyId, session.user.companyId),
        isNull(users.deletedAt)
      ),
      with: {
        emergencyContacts: true,
      },
    });

    if (!user) {
      throw new Error("User not found or access denied");
    }

    const date = new Date();
    const accountAge = Math.floor(
      (date.getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      timestamp: new Date(),
      statusCode: "200",
      message: "User details retrieved successfully",
      dto: {
        profile: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || "",
          status: user.status,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt || user.createdAt,
        },
        activity: {
          lastLogin: user.lastLogin || user.createdAt,
          accountAge,
        },
        emergencyContacts: user.emergencyContacts || [],
      },
    };
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function addUser(userData: IAddUser) {
  try {
    const session = await auth();
    
    if (!session?.user?.companyId) {
      throw new Error("Unauthorized - No company assigned");
    }

    const [newUser] = await db
      .insert(users)
      .values({
        ...userData,
        companyId: session.user.companyId,
        status: "active",
      })
      .returning();

    return {
      timestamp: new Date(),
      statusCode: "201",
      message: "User created successfully",
      dto: newUser,
    };
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function updateUser(id: string, userData: ProfilePayload) {
  try {
    const session = await auth();
    
    if (!session?.user?.companyId) {
      throw new Error("Unauthorized - No company assigned");
    }

    // Verify user belongs to company
    const existing = await db.query.users.findFirst({
      where: and(
        eq(users.id, id),
        eq(users.companyId, session.user.companyId)
      ),
    });

    if (!existing) {
      throw new Error("User not found or access denied");
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    return {
      timestamp: new Date(),
      statusCode: "200",
      message: "User updated successfully",
      dto: updatedUser,
    };
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function toggleUserStatus(id: number,status: string) {
  try {
    const response = await fetch(
      `${process.env.BACKENDBASE_URL}/v1/user/status/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({status: status}),
      }
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to toggle user status");
    }
    return result;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function changePassword({userId, password, oldPassword}: {userId: string, password: string, oldPassword: string}) {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/auth/resetPassword`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({userId: userId, password: password, oldPassword: oldPassword}),
      }
    )

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || "Failed to change password");
    }
  } catch (err) {
    throw new Error((err as Error).message);
  }
}
;
