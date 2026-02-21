import { db } from "@/app/db";
import { documentTypes } from "@/app/db/schema";
import { and, isNull, or, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function getDocumentTypes(
  request: NextRequest,
  companyId: string,
) {
  try {
    const { searchParams } = new URL(request.url);
    const appliesTo = searchParams.get("appliesTo"); // optional filter

    // Fetch system-wide (companyId IS NULL) and company-specific types
    const conditions = [];
    conditions.push(isNull(documentTypes.deletedAt));

    // Always include system-wide types; also include company-specific ones
    const ownerCondition = or(
      isNull(documentTypes.companyId),
      eq(documentTypes.companyId, companyId),
    );
    conditions.push(ownerCondition);

    const types = await db.query.documentTypes.findMany({
      where: (documentTypes, { and, isNull, or, eq }) =>
        and(
          isNull(documentTypes.deletedAt),
          or(
            isNull(documentTypes.companyId),
            eq(documentTypes.companyId, companyId),
          ),
        ),
    });

    // Filter client-side by appliesTo if provided
    const filtered =
      appliesTo && appliesTo !== "all"
        ? types.filter(
            (t) => t.appliesTo === appliesTo || t.appliesTo === "all",
          )
        : types;

    return NextResponse.json(
      {
        message: "Document types fetched successfully",
        dto: filtered,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch document types: " + (error as Error).message,
      },
      { status: 500 },
    );
  }
}
