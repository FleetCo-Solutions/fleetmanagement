import { db } from "@/app/db";
import { trips } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { logAudit, sanitizeForAudit } from "@/lib/audit/logger";
import { auth } from "@/app/auth";

export async function deleteTrip(id: string, companyId: string) {
  const date = new Date();
  try {
    // Get existing trip before deletion
    const existingTrip = await db.query.trips.findFirst({
      where: and(eq(trips.id, id), eq(trips.companyId, companyId)),
    });

    if (!existingTrip) {
      return NextResponse.json(
        {
          success: false,
          message: "Trip not found or access denied",
        },
        { status: 404 }
      );
    }

    // Soft delete trip
    const [existing] = await db
      .update(trips)
      .set({ deletedAt: date })
      .where(and(eq(trips.id, id), eq(trips.companyId, companyId)))
      .returning();

    // Log trip deletion
    const session = await auth();
    if (session?.user?.id) {
      await logAudit({
        action: "trip.deleted",
        entityType: "trip",
        entityId: id,
        oldValues: sanitizeForAudit(existingTrip),
        actorId: session.user.id,
        actorType: "user",
        companyId,
      });
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
