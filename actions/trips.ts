"use server";

import { auth } from "@/app/auth";
import { db } from "@/app/db";
import { trips, vehicles, drivers } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";

export interface Trip {
  id: string;
  vehicleId: string;
  mainDriverId: string;
  substituteDriverId?: string | null;
  startLocation: string;
  endLocation: string;
  startTime: string;
  endTime?: string | null;
  status: "scheduled" | "in_progress" | "completed" | "delayed" | "cancelled";
  distanceKm?: string | null;
  fuelUsed?: string | null;
  durationMinutes?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  vehicle?: any;
  mainDriver?: any;
  substituteDriver?: any;
}

export interface CreateTripPayload {
  vehicleId: string;
  mainDriverId: string;
  substituteDriverId?: string;
  startLocation: string;
  endLocation: string;
  startTime: string;
  endTime?: string;
  status?: "scheduled" | "in_progress" | "completed" | "delayed" | "cancelled";
  distanceKm?: number;
  fuelUsed?: number;
  durationMinutes?: number;
  notes?: string;
}

export interface UpdateTripPayload {
  vehicleId?: string;
  mainDriverId?: string;
  substituteDriverId?: string;
  startLocation?: string;
  endLocation?: string;
  startTime?: string;
  endTime?: string;
  status?: "scheduled" | "in_progress" | "completed" | "delayed" | "cancelled";
  distanceKm?: number;
  fuelUsed?: number;
  durationMinutes?: number;
  notes?: string;
}

export async function getTrips() {
  try {
    const session = await auth();
    
    if (!session?.user?.companyId) {
      throw new Error("Unauthorized - No company assigned");
    }

    const allTrips = await db.query.trips.findMany({
      where: eq(trips.companyId, session.user.companyId),
      with: {
        vehicle: true,
        mainDriver: true,
        substituteDriver: true,
      },
      orderBy: (trips, { desc }) => [desc(trips.createdAt)],
    });

    return {
      timestamp: new Date(),
      statusCode: "200",
      message: "Trips retrieved successfully",
      dto: {
        content: allTrips,
        totalPages: 1,
        totalElements: allTrips.length,
      },
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getTripById(id: string): Promise<{
  timestamp: Date;
  statusCode: string;
  message: string;
  dto: typeof trips.$inferSelect & {
    vehicle: typeof vehicles.$inferSelect | null;
    mainDriver: typeof drivers.$inferSelect | null;
    substituteDriver: typeof drivers.$inferSelect | null;
  };
}> {
  try {
    const session = await auth();
    
    if (!session?.user?.companyId) {
      throw new Error("Unauthorized - No company assigned");
    }

    const trip = await db.query.trips.findFirst({
      where: and(
        eq(trips.id, id),
        eq(trips.companyId, session.user.companyId)
      ),
      with: {
        vehicle: true,
        mainDriver: true,
        substituteDriver: true,
      },
    });

    if (!trip) {
      throw new Error("Trip not found or access denied");
    }

    return {
      timestamp: new Date(),
      statusCode: "200",
      message: "Trip retrieved successfully",
      dto: trip,
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function addTrip(tripData: CreateTripPayload | CreateTripPayload[]) {
  try {
    // Handle if data is wrapped in an array
    const data = Array.isArray(tripData) ? tripData[0] : tripData;
    
    const session = await auth();
    
    if (!session?.user?.companyId) {
      throw new Error("Unauthorized - No company assigned");
    }

    // Validate required fields
    if (!data.vehicleId) {
      throw new Error("Vehicle ID is required");
    }

    if (!data.mainDriverId) {
      throw new Error("Main driver ID is required");
    }

    // Verify vehicle belongs to company
    const vehicle = await db.query.vehicles.findFirst({
      where: and(
        eq(vehicles.id, data.vehicleId),
        eq(vehicles.companyId, session.user.companyId)
      ),
    });

    if (!vehicle) {
      throw new Error("Vehicle not found or access denied");
    }

    const mainDriver = await db.query.drivers.findFirst({
      where: and(
        eq(drivers.id, data.mainDriverId),
        eq(drivers.companyId, session.user.companyId)
      ),
    });

    if (!mainDriver) {
      throw new Error("Main driver not found or access denied");
    }

    if (data.substituteDriverId && data.substituteDriverId.trim() !== "") {
      const subDriver = await db.query.drivers.findFirst({
        where: and(
          eq(drivers.id, data.substituteDriverId),
          eq(drivers.companyId, session.user.companyId)
        ),
      });

      if (!subDriver) {
        throw new Error("Substitute driver not found or access denied");
      }
    }

    const newTrip = await db
      .insert(trips)
      .values({
        vehicleId: data.vehicleId,
        mainDriverId: data.mainDriverId,
        substituteDriverId: data.substituteDriverId && data.substituteDriverId.trim() !== "" 
          ? data.substituteDriverId 
          : null,
        startLocation: data.startLocation,
        endLocation: data.endLocation,
        startTime: new Date(data.startTime),
        endTime: data.endTime && data.endTime.trim() !== "" 
          ? new Date(data.endTime) 
          : null,
        status: data.status || "scheduled",
        distanceKm: data.distanceKm?.toString() || null,
        fuelUsed: data.fuelUsed?.toString() || null,
        durationMinutes: data.durationMinutes?.toString() || null,
        notes: data.notes || null,
        companyId: session.user.companyId,
      })
      .returning();

    return {
      message: "Trip created successfully",
      dto: newTrip[0],
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function updateTrip(id: string, payload: UpdateTripPayload) {
  try {
    const session = await auth();
    
    if (!session?.user?.companyId) {
      throw new Error("Unauthorized - No company assigned");
    }


    const existing = await db.query.trips.findFirst({
      where: and(
        eq(trips.id, id),
        eq(trips.companyId, session.user.companyId)
      ),
    });

    if (!existing) {
      throw new Error("Trip not found or access denied");
    }

    // If updating vehicle, verify ownership
    if (payload.vehicleId) {
      const vehicle = await db.query.vehicles.findFirst({
        where: and(
          eq(vehicles.id, payload.vehicleId),
          eq(vehicles.companyId, session.user.companyId)
        ),
      });

      if (!vehicle) {
        throw new Error("Vehicle not found or access denied");
      }
    }

    // If updating main driver, verify ownership
    if (payload.mainDriverId) {
      const mainDriver = await db.query.drivers.findFirst({
        where: and(
          eq(drivers.id, payload.mainDriverId),
          eq(drivers.companyId, session.user.companyId)
        ),
      });

      if (!mainDriver) {
        throw new Error("Main driver not found or access denied");
      }
    }

    // If updating substitute driver, verify ownership
    if (payload.substituteDriverId) {
      const subDriver = await db.query.drivers.findFirst({
        where: and(
          eq(drivers.id, payload.substituteDriverId),
          eq(drivers.companyId, session.user.companyId)
        ),
      });

      if (!subDriver) {
        throw new Error("Substitute driver not found or access denied");
      }
    }

    // Convert date strings to Date objects
    const updateData: any = { ...payload };
    if (updateData.startTime && typeof updateData.startTime === 'string') {
      updateData.startTime = new Date(updateData.startTime);
    }
    if (updateData.endTime && typeof updateData.endTime === 'string') {
      updateData.endTime = new Date(updateData.endTime);
    }

    const updatedTrip = await db
      .update(trips)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(trips.id, id))
      .returning();

    return {
      message: "Trip updated successfully",
      dto: updatedTrip[0],
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function deleteTrip(id: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.companyId) {
      throw new Error("Unauthorized - No company assigned");
    }

    // Verify trip belongs to company
    const existing = await db.query.trips.findFirst({
      where: and(
        eq(trips.id, id),
        eq(trips.companyId, session.user.companyId)
      ),
    });

    if (!existing) {
      throw new Error("Trip not found or access denied");
    }

    await db.delete(trips).where(eq(trips.id, id));

    return {
      message: "Trip deleted successfully",
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
