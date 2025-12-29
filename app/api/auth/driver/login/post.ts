import { db } from '@/app/db';
import { drivers, trips } from '@/app/db/schema';
import { eq, or } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { generateDriverToken } from '@/lib/auth/jwt';

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
 * Handle driver login with phone number and password
 *
 * @param request - Next.js request object
 * @returns JSON response with JWT token and driver profile
 */
export async function loginDriver(request: NextRequest): Promise<NextResponse<DriverLoginResponse>> {
  try {
    const body = (await request.json()) as DriverLoginRequest;

    // Validate input
    if (!body.phoneNumber || !body.password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Phone number and password are required',
        },
        { status: 400 }
      );
    }

    // Query driver by phone number
    const [driver] = await db
      .select({
        id: drivers.id,
        firstName: drivers.firstName,
        lastName: drivers.lastName,
        phoneNumber: drivers.phone,
        passwordHash: drivers.passwordHash,
        status: drivers.status,
        vehicleId: drivers.vehicleId,
        role: drivers.role,
      })
      .from(drivers)
      .where(eq(drivers.phone, body.phoneNumber))
      .limit(1);

    // Check if driver exists
    if (!driver) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid phone number or password',
        },
        { status: 401 }
      );
    }

    // Check driver status
    if (driver.status !== 'active') {
      return NextResponse.json(
        {
          success: false,
          message: `Driver account is ${driver.status}. Please contact administrator.`,
        },
        { status: 403 }
      );
    }

    // Verify password
    // TODO: Implement proper password hashing (bcrypt) in future
    // Currently passwords are stored as plain text for development
    if (driver.passwordHash !== body.password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid phone number or password',
        },
        { status: 401 }
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
    const assignedTrips = assignedTripsData.filter(
      (trip) => trip.status === 'scheduled' || trip.status === 'in_progress'
    );

    // Update last login timestamp
    await db
      .update(drivers)
      .set({ lastLogin: new Date() })
      .where(eq(drivers.id, driver.id));

    // Generate JWT token
    // Ensure role is not null (default to 'substitute' if null)
    const driverRole: 'main' | 'substitute' = driver.role || 'substitute';
    const token = generateDriverToken({
      driverId: driver.id,
      vehicleId: driver.vehicleId,
      role: driverRole,
      phoneNumber: driver.phoneNumber,
    });

    // Return success response with token and driver profile
    return NextResponse.json(
      {
        success: true,
        token,
        driver: {
          id: driver.id,
          firstName: driver.firstName,
          lastName: driver.lastName,
          phoneNumber: driver.phoneNumber,
          vehicleId: driver.vehicleId,
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
    console.error('Driver login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

