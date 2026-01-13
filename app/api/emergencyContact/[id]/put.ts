import { db } from "@/app/db";
import { emergencyContacts, users, drivers } from "@/app/db/schema";
import { EmergencyContactPayload } from "@/app/types";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function putEmergencyContact(
  id: string,
  companyId: string,
  payload: EmergencyContactPayload
) {
  try {
    // Get existing contact to check ownership
    const existingContact = await db.query.emergencyContacts.findFirst({
      where: eq(emergencyContacts.id, id),
    });

    if (!existingContact) {
      return NextResponse.json(
        { message: "Emergency contact not found" },
        { status: 404 }
      );
    }

    // Verify ownership via user or driver
    if (existingContact.userId) {
      const user = await db.query.users.findFirst({
        where: and(
          eq(users.id, existingContact.userId),
          eq(users.companyId, companyId)
        ),
      });
      if (!user) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
      }
    } else if (existingContact.driverId) {
      const driver = await db.query.drivers.findFirst({
        where: and(
          eq(drivers.id, existingContact.driverId),
          eq(drivers.companyId, companyId)
        ),
      });
      if (!driver) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
      }
    }

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
