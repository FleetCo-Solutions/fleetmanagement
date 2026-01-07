import { db } from "@/app/db";
import {  users } from "@/app/db/schema";
import { sendUserCredentialsEmail } from "@/app/lib/mail";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export interface IPostUser {
firstName:         string;
lastName:          string;
phone:             string;
email:             string;
password?:         string;
}

// export interface EmergencyContact {
// firstName:     string;
// lastName:      string;
// relationship:   "parent" | "spouse" | "sibling" | "friend" | "other";
// address:       string;
// phone:         string;
// alternativeNo: string;
// email:         string;
// }

export default async function postUser(request: Request) {

  try {
    const body = (await request.json()) as IPostUser;

    if ( !body.firstName || !body.lastName || !body.email || !body.phone ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    const plainPassword = body.password || 'Welcome@123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const [user] = await db
      .insert(users)
      .values({
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
        email: body.email,
        passwordHash: hashedPassword,
      })
      .returning()
      .onConflictDoNothing();

    if(user){
      await sendUserCredentialsEmail({
        to: user.email,
        username: user.email,
        password: plainPassword
      })
    }
    
    return NextResponse.json({message:`User Created Successfully`, data:user}, {status: 201});
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
