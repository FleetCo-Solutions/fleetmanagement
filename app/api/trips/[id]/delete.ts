import { db } from "@/app/db";
import { trips } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function deleteTrip(id: string) {
  const date = new Date();
  try {
    const deletedTrip = await db
      .delete(trips)
      .where(eq(trips.id, id))
      .returning();

    if (deletedTrip.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Trip not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        timestamp: date,
        message: "Trip deleted successfully",
        dto: { content: deletedTrip[0] },
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
