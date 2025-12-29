import { db } from '@/app/db';
import { drivers, trips } from '@/app/db/schema';
import { eq, or } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { extractTokenFromHeader, verifyDriverToken } from '@/lib/auth/jwt';

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
    role: 'main' | 'substitute';
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
    const authHeader = request.headers.get('Authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Authorization token is required',
        },
        { status: 401 }
      );
    }

    // Verify token and get driver ID
    let payload;
    try {
      payload = verifyDriverToken(token);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Token verification failed';
      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
        },
        { status: 401 }
      );
    }

    // Query driver by ID
    const [driver] = await db
      .select({
        id: drivers.id,
        firstName: drivers.firstName,
        lastName: drivers.lastName,
        phoneNumber: drivers.phone,
        vehicleId: drivers.vehicleId,
        role: drivers.role,
      })
      .from(drivers)
      .where(eq(drivers.id, payload.driverId))
      .limit(1);

    if (!driver) {
      return NextResponse.json(
        {
          success: false,
          message: 'Driver not found',
        },
        { status: 404 }
      );
    }

    // Check driver status
    const driverDetails = await db.query.drivers.findFirst({
      where: eq(drivers.id, driver.id),
      columns: {
        status: true,
      },
    });

    if (driverDetails?.status !== 'active') {
      return NextResponse.json(
        {
          success: false,
          message: `Driver account is ${driverDetails?.status || 'inactive'}. Please contact administrator.`,
        },
        { status: 403 }
      );
    }

    // Get assigned trips (scheduled or in_progress)
    const assignedTripsData = await db.query.trips.findMany({
      where: or(
        eq(trips.mainDriverId, driver.id),
        eq(trips.substituteDriverId, driver.id)
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
      .filter((trip) => trip.status === 'scheduled' || trip.status === 'in_progress')
      .map((trip) => ({
        id: trip.id,
        vehicleId: trip.vehicleId,
        startLocation: trip.startLocation,
        endLocation: trip.endLocation,
        startTime: trip.startTime.toISOString(),
        status: trip.status,
      }));

    // Ensure role is not null (default to 'substitute' if null)
    const driverRole: 'main' | 'substitute' = driver.role || 'substitute';

    // Return driver profile
    return NextResponse.json(
      {
        success: true,
        driver: {
          id: driver.id,
          firstName: driver.firstName,
          lastName: driver.lastName,
          phoneNumber: driver.phoneNumber,
          vehicleId: driver.vehicleId,
          role: driverRole,
          assignedTrips,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get current driver error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

