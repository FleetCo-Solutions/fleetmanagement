import { db } from "@/app/db";
import { vehicles } from "@/app/db/schema";
import { NextResponse } from "next/server";

export async function getVehiclesList() {
    try{ 
        const vehiclesList = await db.select({
            id: vehicles.id,
            registrationNumber: vehicles.registrationNumber,
            model: vehicles.model,
        }).from(vehicles)

        return NextResponse.json({message: "Vehicles fetched successfully", data: vehiclesList}, {status: 200});
    }catch(error){
        return NextResponse.json({message: "Failed to fetch vehicles" + (error as Error).message}, {status: 500});
    }
}