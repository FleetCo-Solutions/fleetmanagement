import { db } from "@/app/db";
import { drivers, trips } from "@/app/db/schema";
import { eq, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/lib/auth/jwt";

/**
 * Driver login request body
 */
interface DriverLoginRequest {
  phoneNumber: string;
  password: string;
}

/**
 * Driver login response
 */
interface DriverLoginResponse {
  success: boolean;
  token?: string;
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
  };
  message?: string;
}

/**
 * Handle driver login with phone number and password
 *
 * @param request - Next.js request object
 * @returns JSON response with JWT token and driver profile
 */
export async function loginDriver(
  request: NextRequest
): Promise<NextResponse<DriverLoginResponse>> {
  try {
    const body = (await request.json()) as DriverLoginRequest;

    // Validate input
    if (!body.phoneNumber || !body.password) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number and password are required",
        },
        { status: 400 }
      );
    }

    // Query driver by phone number with vehicle relation
    const driverData = await db.query.drivers.findFirst({
      where: eq(drivers.phone, body.phoneNumber),
      with: {
        vehicle: true,
      },
    });

    // Check if driver exists
    if (!driverData) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid phone number or password",
        },
        { status: 401 }
      );
    }

    // Check driver status
    if (driverData.status !== "active") {
      return NextResponse.json(
        {
          success: false,
          message: `Driver account is ${driverData.status}. Please contact administrator.`,
        },
        { status: 403 }
      );
    }

    // Verify password
    // TODO: Implement proper password hashing (bcrypt) in future
    // Currently passwords are stored as plain text for development
    if (driverData.passwordHash !== body.password) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid phone number or password",
        },
        { status: 401 }
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
    const assignedTrips = assignedTripsData.filter(
      (trip) => trip.status === "scheduled" || trip.status === "in_progress"
    );

    // Update last login timestamp
    await db
      .update(drivers)
      .set({ lastLogin: new Date() })
      .where(eq(drivers.id, driverData.id));

    // Generate JWT token
    // Ensure role is not null (default to 'substitute' if null)
    const driverRole: "main" | "substitute" = driverData.role || "substitute";
    const token = generateToken({
      id: driverData.id,
      type: "driver",
      companyId: driverData.companyId || "",
      vehicleId: driverData.vehicleId,
      role: driverRole,
      phoneNumber: driverData.phone,
    });

    // Return success response with token and driver profile
    return NextResponse.json(
      {
        success: true,
        token,
        driver: {
          id: driverData.id,
          firstName: driverData.firstName,
          lastName: driverData.lastName,
          phoneNumber: driverData.phone,
          vehicleId: driverData.vehicleId,
          vehicleName: driverData.vehicle?.registrationNumber || null,
          role: driverRole,
          assignedTrips: assignedTrips.map((trip) => ({
            id: trip.id,
            vehicleId: trip.vehicleId,
            startLocation: trip.startLocation,
            endLocation: trip.endLocation,
            startTime: trip.startTime.toISOString(),
            status: trip.status,
          })),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Driver login error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
