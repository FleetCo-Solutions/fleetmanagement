import { db } from "@/app/db";
import { emergencyContacts } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function deleteEmergencyContact(id: string) {
  try {
    const deletedContact = await db
      .update(emergencyContacts)
      .set({
        deleted: true,
        deletedAt: new Date(),
      })
      .where(eq(emergencyContacts.id, id))
      .returning();

    if (!deletedContact.length) {
      return NextResponse.json(
        { message: "Emergency contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Emergency contact deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting emergency contact:", error);
    return NextResponse.json(
      { message: "Failed to delete emergency contact" },
      { status: 500 }
    );
  }
}
