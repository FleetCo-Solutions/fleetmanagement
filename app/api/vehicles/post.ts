import { auth } from "@/app/auth";
import { db } from "@/app/db";
import { vehicles } from "@/app/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { logAudit, sanitizeForAudit } from "@/lib/audit/logger";

export interface IPostVehicle {
  vehicleRegNo: string;
  vin: string;
  model: string;
  color: string;
  manufacturer: string;
  description?: string;
<<<<<<< Updated upstream
  engineNumber?: string;
  fuelType?: string;
  year?: string;
  tankCapacity?: number;
  targetConsumption?: number;
  inServiceDate?: string;
  inServiceOdometer?: number;
  estimatedServiceLifeMonths?: string;
  estimatedServiceLifeMeter?: number;
  estimatedResaleValue?: number;
  outOfServiceDate?: string;
  outOfServiceOdometer?: number;
  imei?: string;
  simCardNumber?: string;
  status?: string;
  expiryType?: string;
  expiryDate?: string;
=======
  year?: string;
  odometer?: string;
  simSerialNumber?: string;
  flespiIdent?: string;
>>>>>>> Stashed changes
}

export async function postVehicle(request: NextRequest, companyId: string) {
  try {
    const session = await auth();
    const body = (await request.json()) as IPostVehicle;

    // Check required fields
    if (
      !body.manufacturer ||
      !body.model ||
      !body.vehicleRegNo ||
      !body.vin ||
      !body.color
    ) {
      return NextResponse.json(
        {
          message:
            "Missing required fields: manufacturer, model, vehicle registration number, VIN, and color are required",
        },
        { status: 400 }
      );
    }

    // Validate VIN length
    if (body.vin.trim().length !== 17) {
      return NextResponse.json(
        {
          message: "VIN must be exactly 17 characters",
        },
        { status: 400 }
      );
    }

    // Autogenerate Asset ID if not provided (Format: AST-YYYY-RANDOM)
    const assetId = `AST-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const [vehicle] = await db
      .insert(vehicles)
      .values({
        registrationNumber: body.vehicleRegNo.trim(),
        color: body.color.trim(),
        model: body.model.trim(),
        manufacturer: body.manufacturer.trim(),
        vin: body.vin.trim(),
<<<<<<< Updated upstream
        description: body.description?.trim(),
        engineNumber: body.engineNumber?.trim(),
        fuelType: body.fuelType?.trim(),
        year: body.year?.trim(),
        tankCapacity: body.tankCapacity,
        targetConsumption: body.targetConsumption,
        inServiceDate: body.inServiceDate ? new Date(body.inServiceDate) : undefined,
        inServiceOdometer: body.inServiceOdometer,
        estimatedServiceLifeMonths: body.estimatedServiceLifeMonths,
        estimatedServiceLifeMeter: body.estimatedServiceLifeMeter,
        estimatedResaleValue: body.estimatedResaleValue,
        outOfServiceDate: body.outOfServiceDate ? new Date(body.outOfServiceDate) : undefined,
        outOfServiceOdometer: body.outOfServiceOdometer,
        imei: body.imei?.trim(),
        simCardNumber: body.simCardNumber?.trim(),
        status: body.status?.trim(),
        expiryType: body.expiryType?.trim(),
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
=======
        description: body.description?.trim() || null,
        year: body.year?.trim() || null,
        odometer: body.odometer?.trim() || null,
        simSerialNumber: body.simSerialNumber?.trim() || null,
        flespiIdent: body.flespiIdent?.trim() || null,
        assetId: assetId,
>>>>>>> Stashed changes
        companyId: companyId,
      })
      .returning()
      .onConflictDoNothing();

    // Log vehicle creation
    if (session?.user?.id && vehicle) {
      await logAudit({
        action: "vehicle.created",
        entityType: "vehicle",
        entityId: vehicle.id,
        newValues: sanitizeForAudit(vehicle),
        actorId: session.user.id,
        actorType: "user",
        companyId,
        request,
      });
    }

    return NextResponse.json(
      { message: "Vehicle added Successfully", dto: vehicle },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to add a vehicle: " + (error as Error).message },
      { status: 500 }
    );
  }
}
