import { db } from "@/app/db";
import {  users } from "@/app/db/schema";
import { NextResponse } from "next/server";

export interface IPostUser {
firstName:         string;
lastName:          string;
phone:             string;
email:             string;
passwordHash:      string;
emergencyContacts: EmergencyContact[];
}

export interface EmergencyContact {
firstName:     string;
lastName:      string;
relationship:   "parent" | "spouse" | "sibling" | "friend" | "other";
address:       string;
phone:         string;
alternativeNo: string;
email:         string;
}
export default async function postUser(request: Request) {

  try {
    const body = (await request.json()) as IPostUser;

    if (
      !body.firstName ||
      !body.lastName ||
      !body.email ||
      !body.phone
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    const response = await db.transaction(async (tx) => {
      const user = await tx
        .insert(users)
        .values({
          firstName: body.firstName,
          lastName: body.lastName,
          phone: body.phone,
          email: body.email,
        })
        .returning()
        .onConflictDoNothing();

        if (!user || user.length === 0) {
          return { success: false, message: "User with this email already exists", status: 500 };
        }

        return { success: true, data: user[0], status: 201 };

        // const userEmergencyContacts = await Promise.all(
        //     body.emergencyContacts.map(async (contact) => {
        //         return await tx.insert(emergencyContacts).values({
        //             firstName: contact.firstName,
        //             lastName: contact.lastName,
        //             relationship: contact.relationship,
        //             address: contact.address,
        //             phone: contact.phone,
        //             alternativeNo: contact.alternativeNo,
        //             email: contact.email,
        //             userId: user[0].id,
        //         }).returning();
        //     })
        // );

        // const flattenedContacts = userEmergencyContacts.flat();

        // if (!userEmergencyContacts || flattenedContacts.length !== body.emergencyContacts.length) {
        //     return { success: false, message: "Failed to create emergency contact", status: 500};
        // }
        // if (user.length != 0 && userEmergencyContacts.length != 0) {
        //     return { success: true, data: {...user[0], emergencyContact: userEmergencyContacts}, status: 201 };
        // }
    });

    return NextResponse.json(
      { response },
      { status: response?.status }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create user:" + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
