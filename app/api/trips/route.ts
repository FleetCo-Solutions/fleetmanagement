import { getTrips } from "./get";

export async function GET() {
    return getTrips()
}