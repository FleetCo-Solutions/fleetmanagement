import { auth } from "@/app/auth";
import { db } from "@/app/db";
import { drivers, emergencyContacts } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export default async function getDriverDetails(id: string) {
  const date = new Date();
  
  // Get session for authentication and companyId
  const session = await auth();
  
  if (!session?.user?.companyId) {
    return NextResponse.json(
      { message: "Unauthorized - No company assigned" },
      { status: 401 }
    );
  }

  try {
    // Verify driver belongs to user's company
    const driverDetails = await db.query.drivers.findFirst({
      where: and(
        eq(drivers.id, id),
        eq(drivers.companyId, session.user.companyId)
      ),
      with: { emergencyContacts: true }
    });

    if (!driverDetails) {
      return NextResponse.json(
        { timestamp: date, message: "Driver not found or access denied", dto: null },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        timestamp: date,
        message: "Driver details fetched successful",
        dto: {
          profile: {
            id: driverDetails.id,
            firstName: driverDetails.firstName,
            lastName: driverDetails.lastName,
            phone: driverDetails.phone,
            alternativePhone: driverDetails.alternativePhone,
            licenseNumber: driverDetails.licenseNumber,
            licenseExpiry: driverDetails.licenseExpiry,
            status: driverDetails.status,
          },
          activity: {
            lastLogin: driverDetails.lastLogin,
            accountAge: Math.floor(
              (date.getTime() - new Date(driverDetails.createdAt).getTime()) /
                (1000 * 60 * 60 * 24)
            ),
          },
          emergencyContacts: driverDetails.emergencyContacts
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch driver details: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
