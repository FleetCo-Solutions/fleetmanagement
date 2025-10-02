import { NextRequest } from "next/server";
import { getVehicles } from "./get";
import { postVehicle } from "./post";

export async function GET(){
    return getVehicles()
}

export async function POST(request: NextRequest){
    return postVehicle(request)
}