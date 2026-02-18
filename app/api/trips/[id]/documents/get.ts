import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db";
import { tripDocuments } from "@/app/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/app/auth";

export async function getTripDocuments(request: NextRequest, tripId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const documents = await db.query.tripDocuments.findMany({
      where: eq(tripDocuments.tripId, tripId),
      orderBy: [desc(tripDocuments.createdAt)],
    });

    return NextResponse.json({ success: true, data: documents });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
