import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function loginUser(request: NextRequest){
    const { username, password } = await request.json();
    if(!username || !password){
        return NextResponse.json({message: "Email and password are required"}, { status: 400 });
    }

    try {
        const [user] = await db.select({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            password: users.passwordHash,
            status: users.status,
        }).from(users).where(eq(users.email, username)).limit(1)

        if(!user){
            return NextResponse.json({message: "Invalid email or password"}, { status: 401 });
        }
        
        // Here you would normally verify the password with a hashed password stored in the database\
        if(user.password !== password){
            return NextResponse.json({message: "Invalid email or password"}, { status: 401 });
        }

        await db.update(users).set({lastLogin: new Date()}).where(eq(users.id, user.id));

        return NextResponse.json({message: "Login successful", user: user}, { status: 200 });
    }catch (error) {
        return NextResponse.json({message: "Internal server error"}, { status: 500 });
    }
}