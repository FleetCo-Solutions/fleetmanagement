import { db } from "@/app/db";
import { companies, users } from "@/app/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { sendUserCredentialsEmail } from "@/app/lib/mail";

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

      const [adminuser] = await tx
        .insert(users)
        .values({
          firstName: body.contactPerson,
          lastName: "",
          phone: body.contactPhone,
          email: body.contactEmail,
          passwordHash: "Welcome@123",
          companyId: company.id,
        })
        .returning();

      if (adminuser) {
        await sendUserCredentialsEmail({
          to: adminuser.email,
          username: adminuser.email,
          password: "Welcome@123",
        });
      }
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
