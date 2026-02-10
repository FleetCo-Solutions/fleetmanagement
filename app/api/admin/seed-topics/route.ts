import { NextResponse } from "next/server";
import { seedNotificationTopics } from "@/lib/notifications/seed";

export async function GET() {
  try {
    await seedNotificationTopics();
    return NextResponse.json({
      success: true,
      message: "Notification topics seeded",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
