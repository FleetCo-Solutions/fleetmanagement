import { getUsers } from "./get";
import postUser from "./post";

export async function GET() {
    return getUsers()
}

export async function POST(request: Request) {
    return postUser(request);
}