import { db } from "@/app/db";
import { vehicles, drivers } from "@/app/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function fetchVehiclesFromDb(companyId?: string) {
  const allVehicles = companyId
    ? await db.query.vehicles.findMany({
        where: and(
          eq(vehicles.companyId, companyId),
          isNull(vehicles.deletedAt)
        ),
        with: {
          drivers: true
        }
      })
    : await db.query.vehicles.findMany({
        where: isNull(vehicles.deletedAt),
        with: {
          drivers: true
        }
      });

  return allVehicles;
}

export async function fetchVehiclesListFromDb(companyId: string) {
  // Get all vehicles for the company
  const allVehicles = await db.query.vehicles.findMany({
    where: and(
      eq(vehicles.companyId, companyId),
      isNull(vehicles.deletedAt)
    ),
    columns: {
      id: true,
      registrationNumber: true,
      model: true,
      manufacturer: true,
    },
    orderBy: (vehicles, { asc }) => [asc(vehicles.registrationNumber)],
  });

  // For each vehicle, get the assigned driver
  const vehiclesWithDrivers = await Promise.all(
    allVehicles.map(async (vehicle) => {
      const assignedDriver = await db.query.drivers.findFirst({
        where: and(
          eq(drivers.vehicleId, vehicle.id),
          eq(drivers.companyId, companyId)
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

  return vehiclesWithDrivers;
}
