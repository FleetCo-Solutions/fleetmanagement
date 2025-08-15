import { NextRequest } from 'next/server'
import { auth } from '@/app/auth'
import { getRequest } from './get'
import { postRequest } from './post'

export async function GET(request: NextRequest) {
  return getRequest(request);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return new Response("Login to continue!", { status: 401 });
  return postRequest(request);
}
