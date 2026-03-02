import { db } from "@/app/db";
import { devices, vehicles } from "@/app/db/schema";
import { and, eq, isNull } from "drizzle-orm";

export async function getDevice(deviceId: string, companyId: string) {
  const [row] = await db
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
      vehicleId: vehicles.id,
      vehicleReg: vehicles.registrationNumber,
      vehicleModel: vehicles.model,
    })
    .from(devices)
    .leftJoin(vehicles, eq(vehicles.deviceId, devices.id))
    .where(
      and(
        eq(devices.id, deviceId),
        eq(devices.companyId, companyId),
        isNull(devices.deletedAt),
      ),
    )
    .limit(1);

  return row ?? null;
}
