import { db } from "@/app/db";
import { drivers, trips } from "@/app/db/schema";
import { eq, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { extractTokenFromHeader, verifyToken } from "@/lib/auth/jwt";

/**
 * Driver profile response
 */
interface DriverProfileResponse {
  success: boolean;
  driver?: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    vehicleId: string | null;
    vehicleName: string | null;
    role: "main" | "substitute";
    assignedTrips: Array<{
      id: string;
      vehicleId: string | null;
      startLocation: string | null;
      endLocation: string | null;
      startTime: string;
      status: string;
    }>;
    emergencyContacts?: Array<{
      id: string;
      firstName: string;
      lastName: string;
      relationship: string;
      address: string | null;
      phone: string;
      email: string | null;
      alternativeNo: string | null;
      createdAt: string;
      updatedAt: string | null;
    }>;
  };
  message?: string;
}

/**
 * Get current authenticated driver profile
 *
 * @param request - Next.js request object with Authorization header
 * @returns JSON response with driver profile
 */
export async function getCurrentDriver(
  request: NextRequest
): Promise<NextResponse<DriverProfileResponse>> {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get("Authorization");
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Authorization token is required",
        },
        { status: 401 }
      );
    }

    // Verify token and get driver ID
    let payload;
    try {
      payload = verifyToken(token);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Token verification failed";
      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
        },
        { status: 401 }
      );
    }

    // Query driver by ID with vehicle and emergency contacts relations
    const driverData = await db.query.drivers.findFirst({
      where: eq(drivers.id, payload.id),
      with: {
        vehicle: true,
        emergencyContacts: true,
      },
    });

    if (!driverData) {
      return NextResponse.json(
        {
          success: false,
          message: "Driver not found",
        },
        { status: 404 }
      );
    }

    // Check driver status
    if (driverData.status !== "active") {
      return NextResponse.json(
        {
          success: false,
          message: `Driver account is ${
            driverData.status || "inactive"
          }. Please contact administrator.`,
        },
        { status: 403 }
      );
    }

    // Get assigned trips (scheduled or in_progress)
    const assignedTripsData = await db.query.trips.findMany({
      where: or(
        eq(trips.mainDriverId, driverData.id),
        eq(trips.substituteDriverId, driverData.id)
      ),
      columns: {
        id: true,
        vehicleId: true,
        startLocation: true,
        endLocation: true,
        startTime: true,
        status: true,
      },
    });

    // Filter by status (scheduled or in_progress)
    const assignedTrips = assignedTripsData
      .filter(
        (trip) => trip.status === "scheduled" || trip.status === "in_progress"
      )
      .map((trip) => ({
        id: trip.id,
        vehicleId: trip.vehicleId,
        startLocation: trip.startLocation,
        endLocation: trip.endLocation,
        startTime: trip.startTime.toISOString(),
        status: trip.status,
      }));

    // Ensure role is not null (default to 'substitute' if null)
    const driverRole: "main" | "substitute" = driverData.role || "substitute";

    // Get vehicle name
    const vehicleName = driverData.vehicle
      ? driverData.vehicle.manufacturer && driverData.vehicle.model
        ? `${driverData.vehicle.manufacturer} ${driverData.vehicle.model}`
        : driverData.vehicle.registrationNumber || null
      : null;

    // Format emergency contacts (exclude deleted ones)
    const emergencyContacts = (driverData.emergencyContacts || [])
      .filter((contact) => !contact.deleted)
      .map((contact) => ({
        id: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        relationship: contact.relationship,
        address: contact.address,
        phone: contact.phone,
        email: contact.email,
        alternativeNo: contact.alternativeNo,
        createdAt: contact.createdAt.toISOString(),
        updatedAt: contact.updatedAt?.toISOString() || null,
      }));

    // Return driver profile
    return NextResponse.json(
      {
        success: true,
        driver: {
          id: driverData.id,
          firstName: driverData.firstName,
          lastName: driverData.lastName,
          phoneNumber: driverData.phone,
          vehicleId: driverData.vehicleId,
          vehicleName: vehicleName,
          role: driverRole,
          assignedTrips,
          emergencyContacts,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get current driver error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
