import { NextRequest } from "next/server";
import { getTrips } from "./get";
import { postTrip } from "./post";

export async function GET() {
  return getTrips();
}

export async function POST(request: NextRequest) {
  return postTrip(request);
}
