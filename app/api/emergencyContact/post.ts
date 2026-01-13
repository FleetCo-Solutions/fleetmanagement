import { auth } from "@/app/auth";
import { db } from "@/app/db";
import { emergencyContacts, users, drivers } from "@/app/db/schema";
import { EmergencyContactPayload } from "@/app/types";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function postEmergencyContact(payload: EmergencyContactPayload, companyId: string) {
  const date = new Date();
  try {

    if (!payload.firstName) {
      return NextResponse.json(
        { timestamp: date, message: "First Name is required" },
        { status: 400 }
      );
    } else if (!payload.lastName) {
      return NextResponse.json(
        { timestamp: date, message: "Last Name is required" },
        { status: 400 }
      );
    } else if (!payload.relationship) {
      return NextResponse.json(
        { timestamp: date, message: "Relationship is required" },
        { status: 400 }
      );
    } else if (!payload.address) {
      return NextResponse.json(
        { timestamp: date, message: "Address is required" },
        { status: 400 }
      );
    } else if (!payload.phone) {
      return NextResponse.json(
        { timestamp: date, message: "Phone Number is required" },
        { status: 400 }
      );
    }

    // Verify ownership
    if (payload.userId) {
      const user = await db.query.users.findFirst({
        where: and(
          eq(users.id, payload.userId),
          eq(users.companyId, companyId)
        ),
      });
      if (!user) {
        return NextResponse.json(
          { message: "User not found or access denied" },
          { status: 404 }
        );
      }
    } else if (payload.driverId) {
      const driver = await db.query.drivers.findFirst({
        where: and(
          eq(drivers.id, payload.driverId),
          eq(drivers.companyId, companyId)
        ),
      });
      if (!driver) {
        return NextResponse.json(
          { message: "Driver not found or access denied" },
          { status: 404 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "Either userId or driverId must be provided" },
        { status: 400 }
      );
    }

    const emergencyContact = await db
      .insert(emergencyContacts)
      .values(payload)
      .returning()
      .onConflictDoNothing();

    if (emergencyContact.length <= 0) {
      return NextResponse.json(
        { timestamp: date, message: "Failed to add emergency contact" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      timestamp: date,
      message: "Successful added an emergency contact",
      data: emergencyContact,
    });
  } catch (error) {
    return NextResponse.json(
      { timestamp: date, message: (error as Error).message },
      { status: 500 }
    );
  }
}
