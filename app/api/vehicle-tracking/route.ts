import { NextRequest, NextResponse } from 'next/server';
import { mockVehicles, mockTrips } from '@/app/data/mockData';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  if (action === 'vehicles') {
    try {
      return NextResponse.json({
        success: true,
        data: mockVehicles,
      }, { status: 200 });
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch vehicles: ' + (error as Error).message,
      }, { status: 500 });
    }
  }
  
  if (action === 'trips') {
    try {
      return NextResponse.json({
        success: true,
        data: mockTrips,
      }, { status: 200 });
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch trips: ' + (error as Error).message,
      }, { status: 500 });
    }
  }
  
  return NextResponse.json({
    success: false,
    message: 'Invalid action parameter',
  }, { status: 400 });
}