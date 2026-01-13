import { getUsersByCompanyId } from "./get";

export async function GET() {
    return getUsersByCompanyId();
}