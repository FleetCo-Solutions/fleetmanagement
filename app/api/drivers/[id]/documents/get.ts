import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db";
import { driverDocuments } from "@/app/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/app/auth";

export async function getDriverDocuments(
  request: NextRequest,
  driverId: string,
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const documents = await db.query.driverDocuments.findMany({
      where: eq(driverDocuments.driverId, driverId),
      orderBy: [desc(driverDocuments.createdAt)],
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
