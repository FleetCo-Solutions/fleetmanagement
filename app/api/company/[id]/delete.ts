import { db } from "@/app/db";
import { companies } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function deleteCompany(id: string) {
  const date = new Date();
  try {
    const existing = await db
      .update(companies)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(companies.id, id))
      .returning();
    if (existing.length === 1) {
      return NextResponse.json(
        {
          timestamp: date,
          message: "Company Deleted Successfully",
          dto: existing,
        },
        { status: 200 }
      );
    }
    if (existing.length === 0) {
      return NextResponse.json(
        {
          timestamp: date,
          message: "Company Not Found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        timestamp: date,
        message: "Bad Request",
      },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        timestamp: date,
        message: (error as Error).message || "Internal Error Occured",
      },
      { status: 500 }
    );
  }
}
