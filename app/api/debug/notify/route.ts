import { NextResponse } from "next/server";
import { notifyByTopic } from "@/lib/notifications/notifier";
import { auth } from "@/app/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || !(session.user as any).companyId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { topic, title, message } = await req.json();

  if (!topic || !title || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await notifyByTopic({
    companyId: (session.user as any).companyId,
    topic,
    title,
    message,
    actorType: "system_user",
  });

  return NextResponse.json({
    success: true,
    message: "Notification trigger queued",
  });
}
