import { db } from "@/app/db";
import { drivers } from "@/app/db/schema";
import { NextResponse } from "next/server";

export default async function getDriverDetails(){
    try{
        const driverDetails = await db.select().from(drivers);
    }catch(error){
        NextResponse.json({message: "Failed to fetch driver details: "+ (error as Error).message},{status: 500})
    }
}