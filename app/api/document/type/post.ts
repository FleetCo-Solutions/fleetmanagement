import { db } from "@/app/db";
import { documentTypes, documentApplicabilityEnum } from "@/app/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function postDocumentType(
  request: NextRequest,
  companyId: string | null, // null for system-wide, uuid for company-specific
) {
  try {
    const body = await request.json();

    const { name, slug, description, appliesTo, requiresExpiry } = body;

    if (!name || !slug || !appliesTo) {
      return NextResponse.json(
        { message: "Missing required fields: name, slug, appliesTo" },
        { status: 400 },
      );
    }

    const newDocType = await db
      .insert(documentTypes)
      .values({
        companyId: companyId,
        name,
        slug,
        description: description || null,
        appliesTo: appliesTo,
        requiresExpiry: !!requiresExpiry,
      })
      .returning();

    return NextResponse.json(
      {
        message: "Document type created successfully",
        dto: newDocType[0],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create document type:", error);
    return NextResponse.json(
      {
        message: "Failed to create document type: " + (error as Error).message,
      },
      { status: 500 },
    );
  }
}
