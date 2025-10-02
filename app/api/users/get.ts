import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import { NextResponse } from "next/server";

export async function getUsers() {
    const date = new Date()
    try {
        const allUsers = await db.select().from(users);
        return NextResponse.json({timestamp: date, statusCode: "200", message: "Users fetched successful", dto: {content: allUsers, totalPages: 1, totalElements: 0}}, {status: 200});
    }catch(error){
        return NextResponse.json({success: false, message: 'Failed to fetch users:' + (error as Error).message }, {status: 500});
    }
}