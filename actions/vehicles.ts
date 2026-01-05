"use server";

import { auth } from "@/app/auth";
import { db } from "@/app/db";
import { vehicles, drivers, trips } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";
import { IPostVehicle } from "@/app/api/vehicles/post";

export interface UpdateVehiclePayload {
  registrationNumber: string;
  model: string;
  manufacturer: string;
  vin: string;
  color: string;
}

export async function getVehicles() {
  try {
    const session = await auth();
    
    if (!session?.user?.companyId) {
      throw new Error("Unauthorized - No company assigned");
    }

    const allVehicles = await db.query.vehicles.findMany({
      where: eq(vehicles.companyId, session.user.companyId),
      orderBy: (vehicles, { desc }) => [desc(vehicles.createdAt)],
    });

    return {
      timestamp: new Date(),
      statusCode: "200",
      message: "Vehicles retrieved successfully",
      dto: {
        content: allVehicles,
        totalPages: 1,
        totalElements: allVehicles.length,
      },
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getVehiclesList() {
  try {
    const session = await auth();
    
    if (!session?.user?.companyId) {
      throw new Error("Unauthorized - No company assigned");
    }

    // Get all vehicles for the company
    const allVehicles = await db.query.vehicles.findMany({
      where: eq(vehicles.companyId, session.user.companyId),
      columns: {
        id: true,
        registrationNumber: true,
        model: true,
        manufacturer: true,
      },
      orderBy: (vehicles, { asc }) => [asc(vehicles.registrationNumber)],
    });

    // For each vehicle, get the assigned driver (driver with vehicleId matching this vehicle)
    const vehiclesWithDrivers = await Promise.all(
      allVehicles.map(async (vehicle) => {
        const assignedDriver = await db.query.drivers.findFirst({
          where: and(
            eq(drivers.vehicleId, vehicle.id),
            eq(drivers.companyId, session.user.companyId)
          ),
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        });

        return {
          ...vehicle,
          assignedDriver: assignedDriver || null,
        };
      })
    );

    return {
      timestamp: new Date(),
      statusCode: "200",
      message: "Vehicles list retrieved successfully",
      dto: vehiclesWithDrivers,
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getVehicleDetails(id: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.companyId) {
      throw new Error("Unauthorized - No company assigned");
    }

    const vehicle = await db.query.vehicles.findFirst({
      where: and(
        eq(vehicles.id, id),
        eq(vehicles.companyId, session.user.companyId)
      ),
    });

    if (!vehicle) {
      throw new Error("Vehicle not found or access denied");
    }

    return {
      timestamp: new Date(),
      statusCode: "200",
      message: "Vehicle details retrieved successfully",
      dto: vehicle,
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function addVehicle(vehicleData: IPostVehicle) {
  try {
    const session = await auth();
    
    if (!session?.user?.companyId) {
      throw new Error("Unauthorized - No company assigned");
    }

    // Validate required fields
    if (!vehicleData.vehicleRegNo || !vehicleData.vin || !vehicleData.model || 
        !vehicleData.color || !vehicleData.manufacturer) {
      throw new Error("Missing required fields");
    }

    const newVehicle = await db
      .insert(vehicles)
      .values({
        registrationNumber: vehicleData.vehicleRegNo, // Convert from form field name
        vin: vehicleData.vin,
        model: vehicleData.model,
        color: vehicleData.color,
        manufacturer: vehicleData.manufacturer,
        companyId: session.user.companyId,
      })
      .returning();

    return {
      message: "Vehicle created successfully",
      dto: newVehicle[0],
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function updateVehicle(id: string, payload: UpdateVehiclePayload) {
  try {
    const session = await auth();
    
    if (!session?.user?.companyId) {
      throw new Error("Unauthorized - No company assigned");
    }

    // Verify vehicle belongs to company
    const existing = await db.query.vehicles.findFirst({
      where: and(
        eq(vehicles.id, id),
        eq(vehicles.companyId, session.user.companyId)
      ),
    });

    if (!existing) {
      throw new Error("Vehicle not found or access denied");
    }

    const updatedVehicle = await db
      .update(vehicles)
      .set({
        ...payload,
        updatedAt: new Date(),
      })
      .where(eq(vehicles.id, id))
      .returning();

    return {
      message: "Vehicle updated successfully",
      dto: updatedVehicle[0],
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getVehicleDriverHistory(id: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.companyId) {
      throw new Error("Unauthorized - No company assigned");
    }

    // Verify vehicle belongs to company
    const vehicle = await db.query.vehicles.findFirst({
      where: and(
        eq(vehicles.id, id),
        eq(vehicles.companyId, session.user.companyId)
      ),
    });

    if (!vehicle) {
      throw new Error("Vehicle not found or access denied");
    }

    // Get all trips for this vehicle with driver information
    const vehicleTrips = await db.query.trips.findMany({
      where: and(
        eq(trips.vehicleId, id),
        eq(trips.companyId, session.user.companyId)
      ),
      with: {
        mainDriver: true,
        substituteDriver: true,
      },
      orderBy: (trips, { desc }) => [desc(trips.startTime)],
    });

    // Build driver history from trips
    const driverHistory = vehicleTrips.map(trip => ({
      driverId: trip.mainDriver?.id,
      driverName: trip.mainDriver ? `${trip.mainDriver.firstName} ${trip.mainDriver.lastName}` : "Unknown",
      assignedDate: trip.startTime,
      endDate: trip.endTime,
      status: trip.status,
    }));

    return {
      timestamp: new Date(),
      statusCode: "200",
      message: "Driver history retrieved successfully",
      dto: driverHistory,
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getVehicleTrips(id: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.companyId) {
      throw new Error("Unauthorized - No company assigned");
    }

    // Verify vehicle belongs to company
    const vehicle = await db.query.vehicles.findFirst({
      where: and(
        eq(vehicles.id, id),
        eq(vehicles.companyId, session.user.companyId)
      ),
    });

    if (!vehicle) {
      throw new Error("Vehicle not found or access denied");
    }

    // Get all trips for this vehicle
    const vehicleTrips = await db.query.trips.findMany({
      where: and(
        eq(trips.vehicleId, id),
        eq(trips.companyId, session.user.companyId)
      ),
      with: {
        mainDriver: true,
        substituteDriver: true,
      },
      orderBy: (trips, { desc }) => [desc(trips.startTime)],
    });

    return {
      timestamp: new Date(),
      statusCode: "200",
      message: "Vehicle trips retrieved successfully",
      dto: {
        content: vehicleTrips,
        totalPages: 1,
        totalElements: vehicleTrips.length,
      },
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
