import { NextRequest } from 'next/server'
import { auth } from '@/app/auth'
import { getRequest } from './get'
import { putRequest } from './put'
import { deleteRequest } from './delete'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return getRequest(request, { params });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) return new Response("Login to continue!", { status: 401 });
  return putRequest(request, { params });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) return new Response("Login to continue!", { status: 401 });
  return deleteRequest(request, { params });
} 