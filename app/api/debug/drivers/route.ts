import { auth } from "@/app/auth";
import { db } from "@/app/db";
import { drivers } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  
  // Get ALL drivers (no filter) to debug
  const allDrivers = await db.select().from(drivers);
  
  // Get drivers filtered by companyId
  const companyDrivers = session?.user?.companyId 
    ? await db.select().from(drivers).where(eq(drivers.companyId, session.user.companyId))
    : [];

  return NextResponse.json({
    session: {
      authenticated: !!session?.user,
      companyId: session?.user?.companyId,
      email: session?.user?.email,
    },
    allDriversCount: allDrivers.length,
    allDrivers: allDrivers.map(d => ({
      id: d.id,
      name: `${d.firstName} ${d.lastName}`,
      companyId: d.companyId,
      phone: d.phone,
    })),
    companyDriversCount: companyDrivers.length,
    companyDrivers: companyDrivers.map(d => ({
      id: d.id,
      name: `${d.firstName} ${d.lastName}`,
      companyId: d.companyId,
      phone: d.phone,
    })),
  });
}
