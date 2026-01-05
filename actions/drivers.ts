"use server";

import { auth } from "@/app/auth";
import { db } from "@/app/db";
import { drivers, vehicles } from "@/app/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { AssignDriverRequestBody } from "@/app/api/drivers/assignDriver/post";

export interface AddDriverPayload {
  firstName: string;
  lastName: string;
  phone: string;
  alternativePhone?: string;
  licenseNumber: string;
  licenseExpiry: string;
  status?: "active" | "inactive" | "suspended";
}

export async function getDrivers() {
  try {
    const session = await auth();
    
    if (!session?.user?.companyId) {
      throw new Error("Unauthorized - No company assigned");
    }

    const listDrivers = await db.query.drivers.findMany({
      where: and(
        eq(drivers.companyId, session.user.companyId),
        isNull(drivers.deletedAt)
      ),
      with: {
        vehicle: true
      }
    });

    return {
      timestamp: new Date(),
      statusCode: "200",
      message: "Drivers fetched successful",
      dto: { content: listDrivers, totalPages: 1, totalElements: listDrivers.length }
    };
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function getDriversList() {
  try {
    const session = await auth();
    
    if (!session?.user?.companyId) {
      throw new Error("Unauthorized - No company assigned");
    }

    const driversList = await db.query.drivers.findMany({
      where: eq(drivers.companyId, session.user.companyId),
      columns: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        status: true,
      },
      orderBy: (drivers, { asc }) => [asc(drivers.firstName)],
    });

    return {
      timestamp: new Date(),
      statusCode: "200",
      message: "Drivers list retrieved successfully",
      dto: driversList,
    };
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function getDriverDetails(id: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.companyId) {
      throw new Error("Unauthorized - No company assigned");
    }

    const date = new Date();

    // Query driver with company verification
    const driverDetails = await db.query.drivers.findFirst({
      where: and(
        eq(drivers.id, id),
        eq(drivers.companyId, session.user.companyId)
      ),
      with: { emergencyContacts: true }
    });

    if (!driverDetails) {
      throw new Error("Driver not found or access denied");
    }

    return {
      timestamp: date,
      message: "Driver details fetched successful",
      dto: {
        profile: {
          id: driverDetails.id,
          firstName: driverDetails.firstName,
          lastName: driverDetails.lastName,
          phone: driverDetails.phone,
          alternativePhone: driverDetails.alternativePhone,
          licenseNumber: driverDetails.licenseNumber,
          licenseExpiry: driverDetails.licenseExpiry,
          status: driverDetails.status,
        },
        activity: {
          lastLogin: driverDetails.lastLogin,
          accountAge: Math.floor(
            (date.getTime() - new Date(driverDetails.createdAt).getTime()) /
              (1000 * 60 * 60 * 24)
          ),
        },
        emergencyContacts: driverDetails.emergencyContacts
      },
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function assignDriverToVehicle(payload: AssignDriverRequestBody) {
  try {
    const session = await auth();
    
    if (!session?.user?.companyId) {
      throw new Error("Unauthorized - No company assigned");
    }

    const { driverId, vehicleId, role } = payload;

    if (!driverId || !vehicleId || !role) {
      throw new Error("Missing required fields");
    }

    const driver = await db.query.drivers.findFirst({
      where: and(
        eq(drivers.id, driverId),
        eq(drivers.companyId, session.user.companyId)
      ),
    });

    if (!driver) {
      throw new Error("Driver not found or access denied");
    }

    const vehicle = await db.query.vehicles.findFirst({
      where: and(
        eq(vehicles.id, vehicleId),
        eq(vehicles.companyId, session.user.companyId)
      ),
    });

    if (!vehicle) {
      throw new Error("Vehicle not found or access denied");
    }

    const updatedDriver = await db
      .update(drivers)
      .set({
        vehicleId: vehicleId,
        role: role,
        updatedAt: new Date(),
      })
      .where(eq(drivers.id, driverId))
      .returning();

    return {
      message: "Driver assigned to vehicle successfully",
      dto: updatedDriver[0],
    };
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function unassignDriver(driverId: string) {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/drivers/unassignDriver`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ driverId }),
      }
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to unassign driver");
    }
    return result;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function getDriverDashboard() {
  try {
    const session = await auth();
    
    if (!session?.user?.companyId) {
      throw new Error("Unauthorized - No company assigned");
    }

    const allDrivers = await db.query.drivers.findMany({
      where: and(
        eq(drivers.companyId, session.user.companyId),
        isNull(drivers.deletedAt)
      ),
      with: {
        vehicle: true
      }
    });

    // Calculate dashboard stats
    const totalDrivers = allDrivers.length;
    const activeDrivers = allDrivers.filter(d => d.status === 'active').length;
    const assignedDrivers = allDrivers.filter(d => d.vehicleId).length;
    const unassignedDrivers = totalDrivers - assignedDrivers;

    return {
      timestamp: new Date(),
      statusCode: "200",
      message: "Driver dashboard fetched successful",
      dto: {
        totalDrivers,
        activeDrivers,
        assignedDrivers,
        unassignedDrivers,
        drivers: allDrivers
      }
    };
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function addDriver(driverData: AddDriverPayload) {
  try {
    const session = await auth();
    
    if (!session?.user?.companyId) {
      throw new Error("Unauthorized - No company assigned");
    }

    // Validate required fields
    if (!driverData.firstName || !driverData.lastName || !driverData.licenseNumber || 
        !driverData.licenseExpiry || !driverData.phone) {
      throw new Error("Missing required fields");
    }

    const [newDriver] = await db
      .insert(drivers)
      .values({
        firstName: driverData.firstName,
        lastName: driverData.lastName,
        phone: driverData.phone,
        alternativePhone: driverData.alternativePhone && driverData.alternativePhone.trim() !== '' 
          ? driverData.alternativePhone 
          : null,
        licenseNumber: driverData.licenseNumber,
        licenseExpiry: driverData.licenseExpiry,
        status: driverData.status || 'active',
        companyId: session.user.companyId, // Auto-assign from session
      })
      .returning();

    if (!newDriver) {
      throw new Error("Failed to create driver - possible duplicate license or phone number");
    }

    return {
      message: "Driver Created Successfully",
      data: newDriver
    };
  } catch (err) {
    console.error('Add driver error:', err);
    throw new Error((err as Error).message);
  }
}

export interface UpdateDriverPayload {
  firstName: string;
  lastName: string;
  phone: string;
  alternativePhone?: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: "active" | "inactive" | "suspended";
}

export async function updateDriver(
  id: string,
  driverData: UpdateDriverPayload
) {
  try {
    const session = await auth();
    
    if (!session?.user?.companyId) {
      throw new Error("Unauthorized - No company assigned");
    }

    const existing = await db.query.drivers.findFirst({
      where: and(
        eq(drivers.id, id),
        eq(drivers.companyId, session.user.companyId)
      )
    });

    if (!existing) {
      throw new Error("Driver not found or access denied");
    }

    const updatedDriver = await db
      .update(drivers)
      .set({
        firstName: driverData.firstName,
        lastName: driverData.lastName,
        phone: driverData.phone,
        alternativePhone: driverData.alternativePhone,
        licenseNumber: driverData.licenseNumber,
        licenseExpiry: driverData.licenseExpiry,
        status: driverData.status,
        updatedAt: new Date(),
      })
      .where(eq(drivers.id, id))
      .returning();

    return {
      message: "Driver updated successfully",
      dto: updatedDriver[0],
    };
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function getDriverVehicleHistory(id: string) {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/drivers/${id}/vehicle-history`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch vehicle history");
    }
    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getDriverTrips(id: string) {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/drivers/${id}/trips`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch driver trips");
    }
    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
