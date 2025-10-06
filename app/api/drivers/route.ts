import { NextRequest } from "next/server";
import { getDrivers } from "./get";
import postDriver from "./post";

export async function GET(){
    return getDrivers()
}

export async function POST(request: NextRequest){
    return postDriver(request)
}