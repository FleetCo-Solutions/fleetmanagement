import { NextRequest, NextResponse } from "next/server";
import { checkExpiringVehicleDocuments } from "@/lib/jobs/checkExpiringDocuments";

export async function GET(request: NextRequest) {
  // Verify cron secret if needed
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const result = await checkExpiringVehicleDocuments();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
