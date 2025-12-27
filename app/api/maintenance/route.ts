import { NextRequest } from "next/server";
import { getMaintenanceRecords } from "./get";
import { postMaintenanceRecord } from "./post";

export async function GET() {
  return getMaintenanceRecords();
}

export async function POST(request: NextRequest) {
  return postMaintenanceRecord(request);
}
