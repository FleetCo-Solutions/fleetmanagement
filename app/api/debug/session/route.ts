import { auth } from "@/app/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  
  return NextResponse.json({
    authenticated: !!session?.user,
    user: session?.user || null,
    hasCompanyId: !!session?.user?.companyId,
    session: session,
  });
}
