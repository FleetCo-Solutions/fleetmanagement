import { auth } from "@/app/auth";
import { db } from "@/app/db";
import { trips } from "@/app/db/schema";
import { eq, and, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { extractTokenFromHeader, verifyDriverToken } from "@/lib/auth/jwt";

export async function getTripById(request: NextRequest, id: string) {
  const date = new Date();
  try {
    let companyId: string | null = null;
    let driverId: string | null = null;

    // Check for Bearer token first (mobile app authentication)
    const authHeader = request.headers.get("Authorization");
    const token = extractTokenFromHeader(authHeader);

    if (token) {
      try {
        // Verify driver token and extract companyId and driverId
        const payload = verifyDriverToken(token);
        companyId = payload.companyId || null;
        driverId = payload.driverId || null;
      } catch (error) {
        // Token verification failed
        return NextResponse.json(
          {
            success: false,
            message: "Invalid or expired token",
          },
          { status: 401 }
        );
      }
    } else {
      // Fall back to NextAuth session (web app authentication)
      const session = await auth();
      if (!session?.user?.companyId) {
        return NextResponse.json(
          { message: "Unauthorized - No company assigned" },
          { status: 401 }
        );
      }
      companyId = session.user.companyId;
    }

    if (!companyId) {
      return NextResponse.json(
        { message: "Unauthorized - No company assigned" },
        { status: 401 }
      );
    }

    // Build where clause: trip must belong to company
    // If driverId is present, also check that trip is assigned to this driver
    let whereClause = and(eq(trips.id, id), eq(trips.companyId, companyId));

    // If authenticated as driver, verify trip is assigned to them
    if (driverId) {
      whereClause = and(
        eq(trips.id, id),
        eq(trips.companyId, companyId),
        or(
          eq(trips.mainDriverId, driverId),
          eq(trips.substituteDriverId, driverId)
        )
      );
    }

    const trip = await db.query.trips.findFirst({
      where: whereClause,
      with: {
        vehicle: true,
        mainDriver: true,
        substituteDriver: true,
      },
    });

    if (!trip) {
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
        statusCode: "200",
        message: "Trip fetched successfully",
        dto: { content: trip },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch trip: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
