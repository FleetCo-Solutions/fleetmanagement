import { auth } from "@/app/auth";
import { db } from "@/app/db";
import { trips } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function deleteTrip(id: string) {
  const date = new Date();
  try {
    const session = await auth();

    if (!session?.user?.companyId) {
      return NextResponse.json(
        { message: "Unauthorized - No company assigned" },
        { status: 401 }
      );
    }

    // Verify trip belongs to company
    const existing = await db.query.trips.findFirst({
      where: and(eq(trips.id, id), eq(trips.companyId, session.user.companyId)),
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Trip not found or access denied",
        },
        { status: 404 }
      );
    }

    const deletedTrip = await db
      .delete(trips)
      .where(eq(trips.id, id))
      .returning();

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
