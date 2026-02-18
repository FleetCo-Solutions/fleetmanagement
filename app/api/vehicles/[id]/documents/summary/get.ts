import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db";
import { vehicleDocuments } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/app/auth";

export async function getDocumentsSummary(
  request: NextRequest,
  vehicleId: string,
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const soonThreshold = new Date();
    soonThreshold.setDate(now.getDate() + 30);

    const docs = await db.query.vehicleDocuments.findMany({
      where: eq(vehicleDocuments.vehicleId, vehicleId),
    });

    const total = docs.length;
    const expired = docs.filter(
      (d) => d.expiryDate && new Date(d.expiryDate) < now,
    ).length;
    const expiringSoon = docs.filter(
      (d) =>
        d.expiryDate &&
        new Date(d.expiryDate) >= now &&
        new Date(d.expiryDate) <= soonThreshold,
    ).length;

    return NextResponse.json({
      success: true,
      data: {
        total,
        expired,
        expiringSoon,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
