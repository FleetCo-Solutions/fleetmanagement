import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db";
import { vehicleDocuments } from "@/app/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/app/auth";

export async function getVehicleDocuments(
  request: NextRequest,
  vehicleId: string,
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const documents = await db.query.vehicleDocuments.findMany({
      where: eq(vehicleDocuments.vehicleId, vehicleId),
      orderBy: [desc(vehicleDocuments.createdAt)],
      with: {
        documentType: true,
      },
    });

    return NextResponse.json({ success: true, data: documents });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
