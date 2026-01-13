import { NextRequest } from "next/server";
import { getCompanies } from "./get";
import { postCompany } from "./post";

export async function GET() {
    return getCompanies();
}

export async function POST(request: NextRequest) {
    return postCompany(request);
}
