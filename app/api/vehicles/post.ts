import { auth } from "@/app/auth";
import { db } from "@/app/db";
import { vehicles } from "@/app/db/schema";
import { NextRequest, NextResponse } from "next/server";

export interface IPostVehicle {
  vehicleRegNo: string;
  vin: string;
  model: string;
  color: string;
  manufacturer: string;
}

export async function postVehicle(request: NextRequest, companyId: string) {
  try {

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

    const [vehicle] = await db
      .insert(vehicles)
      .values({
        registrationNumber: body.vehicleRegNo.trim(),
        color: body.color.trim(),
        model: body.model.trim(),
        manufacturer: body.manufacturer.trim(),
        vin: body.vin.trim(),
        companyId: companyId,
      })
      .returning()
      .onConflictDoNothing();

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
