import { db } from "@/app/db";
import { companies } from "@/app/db/schema";
import { NextRequest, NextResponse } from "next/server";
import postUser from "../users/post";

export async function postCompany(request: NextRequest) {
  try {
    const date = new Date();
    const body = await request.json();
    const result = await db.transaction(async (tx) => {
      const [company] = await tx
        .insert(companies)
        .values({
          name: body.name,
          contactPerson: body.contactPerson,
          contactPhone: body.contactPhone,
          contactEmail: body.contactEmail,
          country: body.country,
          address: body.address,
        })
        .returning();

      await postUser(company.id, {
        firstName: body.contactPerson,
        lastName: "",
        phone: body.contactPhone,
        email: body.contactEmail,
      });
      return company;
    });
    return NextResponse.json(
      {
        timestamp: date,
        success: true,
        message: "Company created successfully",
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
