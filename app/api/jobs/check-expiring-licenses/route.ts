import { NextResponse } from "next/server";
import { checkExpiringLicenses } from "@/lib/jobs/checkExpiringLicenses";
import { auth } from "@/app/auth";

/**
 * API endpoint to manually trigger license expiry check
 * Can be called by:
 * 1. Authenticated system users (for manual testing)
 * 2. External cron services (using CRON_SECRET)
 */
export async function POST(req: Request) {
  try {
    // Check authentication - either session or cron secret
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    let isAuthorized = false;

    // Option 1: Cron secret authentication (for external cron services)
    if (authHeader && cronSecret) {
      const token = authHeader.replace("Bearer ", "");
      if (token === cronSecret) {
        isAuthorized = true;
        console.log("[API] Authenticated via CRON_SECRET");
      }
    }

    // Option 2: Session authentication (for manual testing by system users)
    if (!isAuthorized) {
      const session = await auth();
      if (session?.user) {
        isAuthorized = true;
        console.log(
          `[API] Authenticated via session: ${session.user.email || session.user.name}`,
        );
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Provide valid session or CRON_SECRET." },
        { status: 401 },
      );
    }

    // Run the job
    console.log("[API] Starting license expiry check job...");
    const startTime = Date.now();

    const result = await checkExpiringLicenses();

    const duration = Date.now() - startTime;

    // Return detailed results
    return NextResponse.json({
      success: result.success,
      message: result.success
        ? "License expiry check completed successfully"
        : "License expiry check completed with errors",
      duration: `${duration}ms`,
      summary: {
        totalDriversChecked: result.totalDriversChecked,
        notificationsSent: result.notificationsSent,
        companiesProcessed: result.details.length,
        errors: result.errors.length,
      },
      details: result.details,
      errors: result.errors.length > 0 ? result.errors : undefined,
    });
  } catch (error) {
    console.error("[API] Error in license expiry check endpoint:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

/**
 * GET endpoint for checking job status/info
 */
export async function GET() {
  return NextResponse.json({
    endpoint: "/api/jobs/check-expiring-licenses",
    description: "Manually trigger driver license expiry check",
    authentication: {
      methods: [
        "Session-based (for logged-in users)",
        "Bearer token (CRON_SECRET for external cron)",
      ],
    },
    usage: {
      manual: "POST to this endpoint while logged in",
      cron: "POST with header: Authorization: Bearer <CRON_SECRET>",
    },
    configuration: {
      thresholds: [30, 15, 7, -5],
      description:
        "Notifications sent at 30, 15, 7 days before and 5 days after expiry",
    },
  });
}
