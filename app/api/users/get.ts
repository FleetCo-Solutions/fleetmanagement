import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import { NextResponse } from "next/server";

export async function getUsers() {
  try {
    const date = new Date();
    const usersList = await db.select().from(users);
    if (usersList.length === 0) {
      return NextResponse.json(
        {
          timestamp: date,
          success: true,
          message: "No users found",
        },
        { status: 200 }
      );
    }
    if (usersList.length > 0) {
      return NextResponse.json(
        {
          timestamp: date,
          success: true,
          data: usersList,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
