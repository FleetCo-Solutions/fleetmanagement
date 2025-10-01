import { getVehiclesList } from "./get";

export async function GET() {
    return getVehiclesList();
}