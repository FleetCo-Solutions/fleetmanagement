import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import { NextResponse } from "next/server";

export async function getUsers() {
    try {
        const allUsers = await db.select().from(users);
        return NextResponse.json({success: true, data: allUsers}, {status: 200});
    }catch(error){
        return NextResponse.json({success: false, message: 'Failed to fetch users:' + (error as Error).message }, {status: 500});
    }
}