"use server";

import { IAddUser, ProfilePayload, IUsers, UserDetails } from "@/app/types";
import { auth } from "@/app/auth";
import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import bcrypt from "bcryptjs";

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

    const plainPassword = userData.passwordHash || 'Welcome@123';
    // TODO: Re-enable password hashing after migrating existing passwords
    // const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const [newUser] = await db
      .insert(users)
      .values({
        ...userData,
        passwordHash: plainPassword, // Using plain text for now
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
  } catch (err: any) {
    // Log error for debugging
    console.error("Full error object:", JSON.stringify(err, null, 2));
    console.error("Error code:", err.code);
    console.error("Error constraint:", err.constraint);
    console.error("Error detail:", err.detail);
    
    // PostgreSQL error code for unique constraint violation
    if (err.code === '23505' || err.constraint) {
      const constraint = err.constraint || '';
      const detail = err.detail || '';
      const message = err.message || '';
      
      if (constraint.includes('email') || detail.includes('email') || message.includes('email')) {
        throw new Error("This email is already in use");
      }
      if (constraint.includes('phone') || detail.includes('phone') || message.includes('phone')) {
        throw new Error("This phone number is already in use");
      }
      throw new Error("This email or phone number is already in use");
    }
    
    // Check for duplicate in error message
    const errorMessage = String(err.message || err);
    if (errorMessage.toLowerCase().includes('duplicate') || 
        errorMessage.toLowerCase().includes('unique')) {
      if (errorMessage.includes('email')) {
        throw new Error("This email is already in use");
      }
      if (errorMessage.includes('phone')) {
        throw new Error("This phone number is already in use");
      }
      throw new Error("This email or phone number is already in use");
    }
    
    // If it's a failed query error about insert, likely a constraint issue
    if (errorMessage.includes('Failed query') && errorMessage.includes('insert into "users"')) {
      // Check which fields are in the error
      if (errorMessage.includes(userData.email)) {
        throw new Error("This email or phone number is already in use");
      }
      if (userData.phone && errorMessage.includes(userData.phone)) {
        throw new Error("This email or phone number is already in use");
      }
      throw new Error("This email or phone number is already in use");
    }
    
    throw new Error(err.message || "Failed to create user");
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
