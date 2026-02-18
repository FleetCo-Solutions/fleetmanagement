import { NextRequest } from "next/server";
import { getNotificationTopic } from "./get";
import { updateNotificationTopic } from "./update";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ notificationTopic: string }> },
) {
  const { notificationTopic } = await params;
  return getNotificationTopic(notificationTopic);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ notificationTopic: string }> },
) {
  const { notificationTopic } = await params;
  const data = await request.json();
  return updateNotificationTopic(notificationTopic, data);
}
