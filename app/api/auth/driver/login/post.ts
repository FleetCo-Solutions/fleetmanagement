import { db } from "@/app/db";
import { drivers, trips, driverRoles, roles, vehicles } from "@/app/db/schema";
import { and, eq, isNull, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/lib/auth/jwt";
import bcrypt from "bcryptjs";

interface DriverLoginRequest {
  phoneNumber: string;
  password: string;
}
interface DriverLoginResponse {
  success: boolean;
  token?: string;
  driver?: {
    id: string;
    name: string;
    phoneNumber: string;
    companyId: string;
    role: "main" | "substitute";
  };
  message?: string;
}

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

    const [driver] = await db
      .select()
      .from(drivers)
      .where(
        and(eq(drivers.phone, body.phoneNumber), isNull(drivers.deletedAt))
      )
      .limit(1);

    if (!driver) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid phone number or password",
        },
        { status: 401 }
      );
    }

    if (driver.status !== "active") {
      return NextResponse.json(
        {
          success: false,
          message: `Driver account is ${driver.status}. Please contact administrator.`,
        },
        { status: 401 }
      );
    }

    if (!(await bcrypt.compare(body.password, driver.passwordHash))) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid phone number or password",
        },
        { status: 400 }
      );
    }

    // Update last login timestamp
    await db
      .update(drivers)
      .set({ lastLogin: new Date() })
      .where(eq(drivers.id, driver.id));

    // Fetch driver roles
    const driverRoleList = await db.query.driverRoles.findMany({
      where: eq(driverRoles.driverId, driver.id),
      with: {
        role: true,
      },
    });

    const primaryRole = driverRoleList[0]?.role?.name || "Driver";

    // Generate JWT token
    const token = generateToken({
      id: driver.id,
      type: "driver",
      companyId: driver.companyId!,
      phoneNumber: driver.phone,
      role: primaryRole,
    });

    // Get vehicle information if driver is assigned to a vehicle
    let vehicleName = null;
    if (driver.vehicleId) {
      const vehicle = await db.query.vehicles.findFirst({
        where: eq(vehicles.id, driver.vehicleId),
        columns: {
          manufacturer: true,
          model: true,
          registrationNumber: true,
        },
      });
      
      if (vehicle) {
        vehicleName = vehicle.manufacturer && vehicle.model
          ? `${vehicle.manufacturer} ${vehicle.model}`
          : vehicle.registrationNumber || null;
      }
    }

    return NextResponse.json(
      {
        timestamp: new Date(),
        success: true,
        token,
        driver: {
          id: driver.id,
          name: driver.firstName + " " + driver.lastName,
          phoneNumber: driver.phone,
          role: driver.role!,
          companyId: driver.companyId!,
          vehicleId: driver.vehicleId || null,
          vehicleName: vehicleName,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
