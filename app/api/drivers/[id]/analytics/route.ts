import { NextRequest, NextResponse } from 'next/server';
import { getDriverAnalytics } from './get';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id: driverId } = await props.params;
  return getDriverAnalytics(driverId, request);
}

