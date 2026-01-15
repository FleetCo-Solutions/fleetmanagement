import { db } from "@/app/db";
import { systemUsers } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export interface IEditUser {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: "active"|"inactive"|"suspended";
}

export async function editSystemUser(id: string, userData: IEditUser) {
    const date = new Date();
    try {
        const existingUser = await db.select().from(systemUsers).where(eq(systemUsers.id, id));

        if (existingUser.length === 0) {
            return NextResponse.json(
                { timestamp: date, message: "User not found" },
                { status: 404 }
            );
        }

        if(existingUser.length == 1){
            const result = await db.update(systemUsers).set({
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                phone: userData.phone,
                status: userData.status,
                updatedAt: new Date(),
            }).where(eq(systemUsers.id, id)).returning();

            return NextResponse.json(
                {
                    timestamp: date,
                    message: "User Updated Successfully",
                    dto: result,
                },
                { status: 200 }
            );
        }
        return NextResponse.json(
            { timestamp: date, message: "Bad request on the update system user" },
            { status: 400 }
        );

    } catch (error) {
        return NextResponse.json(
            {
                timestamp: date,
                message: (error as Error).message || "Internal Error Occured",
            },
            { status: 500 }
        );
    }
}