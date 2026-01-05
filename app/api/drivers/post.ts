import { auth } from "@/app/auth";
import { db } from "@/app/db";
import { drivers } from "@/app/db/schema";
import { NextRequest, NextResponse } from "next/server";

interface IPostDriver {
    firstName: string,
    lastName: string,
    phone: string,
    alternativePhone: string,
    licenseNumber: string,
    licenseExpiry: string
}

export default async function postDriver(request: NextRequest){
    // Get session for authentication and companyId
    const session = await auth();
    
    if (!session?.user?.companyId) {
        return NextResponse.json(
            { message: "Unauthorized - No company assigned" },
            { status: 401 }
        );
    }

    try {
        const body = (await request.json()) as IPostDriver

        if ( !body.firstName || !body.lastName || !body.licenseNumber || !body.licenseExpiry || !body.phone ) {
            return NextResponse.json(
                {
                    message: "Missing required fields",
                },
                {status: 400}
            )
        }

        const [driver] = await db
        .insert(drivers)
        .values({
            firstName: body.firstName,
            lastName: body.lastName,
            phone: body.phone,
            alternativePhone: body.alternativePhone,
            licenseNumber: body.licenseNumber,
            licenseExpiry: body.licenseExpiry,
            companyId: session.user.companyId, // Auto-assign companyId from session
        })
        .returning()
        .onConflictDoNothing();

        return NextResponse.json({message: "Driver Created Successfully", data: driver},{status: 201})

    }catch(error){
        return NextResponse.json({message: "Failed to create Driver: "+ (error as Error).message},{status: 500})
    }
}