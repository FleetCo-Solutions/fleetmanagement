import { db } from "@/app/db";
import { vehicles } from "@/app/db/schema";
import { NextRequest, NextResponse } from "next/server";

export interface IPostVehicle {
    vehicleRegNo: string,
    vin: string,
    model: string,
    color: string,
    manufacturer: string
}

export async function postVehicle(request: NextRequest) {
    const body = (await request.json()) as IPostVehicle
    if(!body.vin || !body.color || !body.manufacturer || !body.model || !body.vehicleRegNo){
        return NextResponse.json({
            message: "Missing required fields"
        },{status: 400})
    }
    try {
        const [vehicle] = await db
        .insert(vehicles)
        .values({
            registrationNumber: body.vehicleRegNo,
            color: body.color,
            model: body.model,
            manufacturer: body.manufacturer,
            vin: body.vin
        })
        .returning()
        .onConflictDoNothing()
        return NextResponse.json({message: "Vehicle added Successfully", data: vehicle},{status: 201})
    }catch(error){
        return NextResponse.json({messaage: "Failed to add a vehicle: " + (error as Error).message},{status: 500})
    }
}