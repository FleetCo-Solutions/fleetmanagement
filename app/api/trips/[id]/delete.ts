import { db } from "@/app/db";
import { trips } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function deleteTrip(id: string, companyId: string) {
  const date = new Date();
  try {
    // Verify trip belongs to company
    const [existing] = await db
      .update(trips)
      .set({ deletedAt: date })
      .where(and(eq(trips.id, id), eq(trips.companyId, companyId)))
      .returning();

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Trip not found or access denied",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        timestamp: date,
        message: "Trip deleted successfully",
        dto: existing,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete trip: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
