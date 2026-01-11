import { NextResponse } from "next/server";
import { getOpenAPISpecJSON } from "@/lib/openapi/openapi";

/**
 * GET /api/docs
 * Returns the OpenAPI specification as JSON
 */
export async function GET() {
  try {
    const spec = getOpenAPISpecJSON();
    return NextResponse.json(spec, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating OpenAPI spec:", error);
    return NextResponse.json(
      {
        error: "Failed to generate OpenAPI specification",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
