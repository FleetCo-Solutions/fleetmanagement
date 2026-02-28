
import { db } from "@/app/db";
import { vehicles, vehicleTelemetry } from "@/app/db/schema";
import { inArray, eq } from "drizzle-orm";

interface FlespiMessage {
  ident: string;
  timestamp?: number;
  "server.timestamp"?: number;
  position_latitude?: number;
  position_longitude?: number;
  position_speed?: number;
  position_direction?: number;
  position_altitude?: number;
  position_hdop?: number;
  position_satellites?: number;
  position_valid?: boolean;
  engine_ignition_status?: boolean;
  movement_status?: boolean;
  vehicle_mileage?: number;
  "external.powersource.voltage"?: number;
  battery_voltage?: number;
  gsm_signal_level?: number;
}

export async function FlespiPost(messages: FlespiMessage[]) {
  try {
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response("OK", { status: 200 });
    }

    // ── 1. Resolve idents → vehicle rows (one query for the whole batch) ───────
    const uniqueIdents = [...new Set(messages.map((m) => m.ident))];

    const matchedVehicles = await db
      .select({
        id: vehicles.id,
        companyId: vehicles.companyId,
        flespiIdent: vehicles.flespiIdent,
      })
      .from(vehicles)
      .where(inArray(vehicles.flespiIdent, uniqueIdents));

    // Build a quick lookup: ident → { vehicleId, companyId }
    const identMap = new Map(
      matchedVehicles.map((v) => [
        v.flespiIdent!,
        { vehicleId: v.id, companyId: v.companyId },
      ]),
    );

    // ── 2. Map all messages to telemetry rows ─────────────────────────────────
    const telemetryRows = messages.map((msg) => {
      const match = identMap.get(msg.ident);
      return {
        vehicleId: match?.vehicleId ?? null,
        companyId: match?.companyId ?? null,
        flespiIdent: msg.ident,
        recordedAt: msg.timestamp ? new Date(msg.timestamp * 1000) : new Date(),
        serverRecordedAt: msg["server.timestamp"]
          ? new Date(msg["server.timestamp"] * 1000)
          : null,
        latitude: msg.position_latitude ?? null,
        longitude: msg.position_longitude ?? null,
        speed: msg.position_speed ?? null,
        direction: msg.position_direction ?? null,
        altitude: msg.position_altitude ?? null,
        hdop: msg.position_hdop ?? null,
        satellites: msg.position_satellites ?? null,
        positionValid: msg.position_valid ?? null,
        ignition: msg.engine_ignition_status ?? null,
        movement: msg.movement_status ?? null,
        mileage: msg.vehicle_mileage ?? null,
        externalVoltage: msg["external.powersource.voltage"] ?? null,
        batteryVoltage: msg.battery_voltage ?? null,
        gsmSignal: msg.gsm_signal_level ?? null,
      };
    });

    // ── 3. Batch insert all telemetry rows (single query) ─────────────────────
    await db.insert(vehicleTelemetry).values(telemetryRows);

    // ── 4. Upsert vehicleLocations for each matched vehicle ───────────────────
    // Take the latest message per vehicle (highest timestamp) so the map is current.
    // const latestByVehicle = new Map<string, FlespiMessage>();
    // for (const msg of messages) {
    //   const match = identMap.get(msg.ident);
    //   if (!match) continue; // unregistered device — skip location update
    //   if (msg.position_latitude == null || msg.position_longitude == null)
    //     continue;

    //   const existing = latestByVehicle.get(match.vehicleId);
    //   if (!existing || (msg.timestamp ?? 0) > (existing.timestamp ?? 0)) {
    //     latestByVehicle.set(match.vehicleId, msg);
    //   }
    // }

    // for (const [vehicleId, msg] of latestByVehicle.entries()) {
    //   const match = identMap.get(msg.ident)!;
    //   await db
    //     .insert(vehicleLocations)
    //     .values({
    //       vehicleId,
    //       companyId: match.companyId ?? undefined,
    //       latitude: msg.position_latitude!,
    //       longitude: msg.position_longitude!,
    //       heading: msg.position_direction ?? null,
    //       speed: msg.position_speed ?? null,
    //       status: msg.engine_ignition_status ? "moving" : "stopped",
    //       updatedAt: msg.timestamp
    //         ? new Date(msg.timestamp * 1000)
    //         : new Date(),
    //     })
    //     .onConflictDoUpdate({
    //       target: vehicleLocations.vehicleId,
    //       set: {
    //         latitude: msg.position_latitude!,
    //         longitude: msg.position_longitude!,
    //         heading: msg.position_direction ?? null,
    //         speed: msg.position_speed ?? null,
    //         status: msg.engine_ignition_status ? "moving" : "stopped",
    //         updatedAt: msg.timestamp
    //           ? new Date(msg.timestamp * 1000)
    //           : new Date(),
    //       },
    //     });
    // }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("[flespi] ingest error:", err);
    // Still return 200 to prevent flespi from retrying indefinitely.
    // The error is logged; investigate in server logs.
    return new Response("OK", { status: 200 });
  }
}
