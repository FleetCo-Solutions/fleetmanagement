import { db } from "@/app/db";
import { drivers } from "@/app/db/schema";
import { NextResponse } from "next/server";

export async function getDriversList() {
    try{
        const driversList = await db.select({
            id: drivers.id,
            firstName: drivers.firstName,
            lastName: drivers.lastName,
            phone: drivers.phone,
            LicenseNumber: drivers.licenseNumber,
            licenseExpiryDate: drivers.licenseExpiry,
        }).from(drivers);

        return NextResponse.json({mesage: "Drivers fetched successfully", data: driversList}, {status: 200});
    }catch(error){
        return NextResponse.json({message: "Failed to fetch drivers" + (error as Error).message}, {status: 500});
    }
}