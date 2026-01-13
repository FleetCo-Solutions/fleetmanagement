import { getSystemUsers } from "./get";

export async function GET() {
    return getSystemUsers();
}