import { db } from "@/app/db";
import { devices, vehicles } from "@/app/db/schema";
import { and, eq, isNull } from "drizzle-orm";

export async function getDevices(companyId: string) {
  const rows = await db
    .select({
      id: devices.id,
      deviceName: devices.deviceName,
      model: devices.model,
      imei: devices.imei,
      serialNumber: devices.serialNumber,
      warrantyExpiryDate: devices.warrantyExpiryDate,
      status: devices.status,
      notes: devices.notes,
      createdAt: devices.createdAt,
      updatedAt: devices.updatedAt,
      // Joined vehicle info
      vehicleId: vehicles.id,
      vehicleReg: vehicles.registrationNumber,
      vehicleModel: vehicles.model,
    })
    .from(devices)
    .leftJoin(vehicles, eq(vehicles.deviceId, devices.id))
    .where(and(eq(devices.companyId, companyId), isNull(devices.deletedAt)))
    .orderBy(devices.createdAt);

  return rows;
}
