import { db } from "@/app/db";
import { emergencyContacts } from "@/app/db/schema";
import { EmergencyContactPayload } from "@/app/types";
import { NextResponse } from "next/server";

export async function postEmergencyContact(payload: EmergencyContactPayload) {
  const date = new Date();
  try {
    if (!payload.firstName) {
      return NextResponse.json(
        { timestamp: date, message: "User ID is required" },
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
