import { NextResponse } from "next/server";
import { checkExpiringLicenses } from "@/lib/jobs/checkExpiringLicenses";
import { auth } from "@/app/auth";

/**
 * API endpoint to manually trigger license expiry check
 * Can be called by:
 * 1. Authenticated system users (for manual testing)
 * 2. External cron services (using CRON_SECRET)
 */
async function handleJob(req: Request) {
  try {
    // Check authentication - either session, cron secret header, or secret query param
    const { searchParams } = new URL(req.url);
    const querySecret = searchParams.get("secret");
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    let isAuthorized = false;

    // Option 1: Cron secret authentication (Header or Query Param)
    if (cronSecret) {
      if (querySecret === cronSecret) {
        isAuthorized = true;
        console.log("[API] Authenticated via secret query parameter");
      } else if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        if (token === cronSecret) {
          isAuthorized = true;
          console.log("[API] Authenticated via CRON_SECRET header");
        }
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

export async function POST(req: Request) {
  return handleJob(req);
}

export async function GET(req: Request) {
  // If no auth header and not logged in, we could return info,
  // but for simplicity let's just use the shared handler.
  // Vercel Cron will send the Authorization header.
  return handleJob(req);
}
