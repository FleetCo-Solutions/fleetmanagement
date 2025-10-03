import { getDriversList } from "./get";

export async function GET() {
    return getDriversList();
}