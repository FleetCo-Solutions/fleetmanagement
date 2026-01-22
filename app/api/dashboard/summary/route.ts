import { getAuthenticatedUser } from "@/lib/auth/utils";
import { db } from "@/app/db";
import { vehicles, trips, maintenanceRecords } from "@/app/db/schema";
import { and, eq, isNull, count, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user || !("companyId" in user)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const companyId = user.companyId;

    // 1. Vehicle Counts
    const totalVehicles = await db
      .select({ count: count() })
      .from(vehicles)
      .where(
        and(eq(vehicles.companyId, companyId), isNull(vehicles.deletedAt))
      );

    const inTripVehicles = await db
      .select({ count: count() })
      .from(trips)
      .where(
        and(
          eq(trips.companyId, companyId),
          eq(trips.status, "in_progress"),
          isNull(trips.deletedAt)
        )
      );

    const maintenanceVehicles = await db
      .select({ count: count() })
      .from(maintenanceRecords)
      .where(
        and(
          eq(maintenanceRecords.companyId, companyId),
          eq(maintenanceRecords.status, "in_progress")
        )
      );

    const total = Number(totalVehicles[0]?.count || 0);
    const inTrip = Number(inTripVehicles[0]?.count || 0);
    const underMaintenance = Number(maintenanceVehicles[0]?.count || 0);
    const available = Math.max(0, total - inTrip - underMaintenance);

    // 2. Recent Trips (Top 5)
    const recentTrips = await db.query.trips.findMany({
      where: and(eq(trips.companyId, companyId), isNull(trips.deletedAt)),
      with: {
        vehicle: true,
        mainDriver: true,
      },
      orderBy: [desc(trips.startTime)],
      limit: 5,
    });

    // 3. Mock Data for Charts (to be replaced with real logic if tables exist)
    const performanceData = [
      { name: "Mon", value: 400 },
      { name: "Tue", value: 300 },
      { name: "Wed", value: 600 },
      { name: "Thu", value: 800 },
      { name: "Fri", value: 500 },
      { name: "Sat", value: 900 },
      { name: "Sun", value: 700 },
    ];

    const violationsData = [
      { name: "Speeding", value: 40 },
      { name: "Harsh Braking", value: 30 },
      { name: "Idling", value: 20 },
      { name: "Others", value: 10 },
    ];

    return NextResponse.json(
      {
        success: true,
        data: {
          vehicles: {
            total,
            available,
            inTrip,
            underMaintenance,
            outOfService: underMaintenance, // Using underMaintenance as a proxy for outOfService for now
          },
          recentTrips: recentTrips.map((t) => ({
            id: t.id,
            driverName: `${t.mainDriver?.firstName} ${t.mainDriver?.lastName}`,
            tripStartTime: t.startTime,
            phoneNo: t.mainDriver?.phone,
            destination: t.endLocation,
            vehicleReg: t.vehicle?.registrationNumber,
            violationRate: 0, // Mock for now
            fuelUsage: Number(t.fuelUsed || 0),
          })),
          performance: performanceData,
          violations: violationsData,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error: " + (error as Error).message },
      { status: 500 }
    );
  }
}
