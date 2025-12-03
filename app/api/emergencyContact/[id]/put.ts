import { db } from "@/app/db";
import { emergencyContacts } from "@/app/db/schema";
import { EmergencyContactPayload } from "@/app/types";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function putEmergencyContact(
  id: string,
  payload: EmergencyContactPayload
) {
  try {
    const updatedContact = await db
      .update(emergencyContacts)
      .set({
        firstName: payload.firstName,
        lastName: payload.lastName,
        relationship: payload.relationship,
        address: payload.address,
        phone: payload.phone,
        email: payload.email,
        alternativeNo: payload.alternativeNo,
        updatedAt: new Date(),
      })
      .where(eq(emergencyContacts.id, id))
      .returning();

    if (!updatedContact.length) {
      return NextResponse.json(
        { message: "Emergency contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Emergency contact updated successfully",
        dto: updatedContact[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating emergency contact:", error);
    return NextResponse.json(
      { message: "Failed to update emergency contact" },
      { status: 500 }
    );
  }
}
