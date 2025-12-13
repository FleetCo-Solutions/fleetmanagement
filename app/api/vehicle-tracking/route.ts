import { NextRequest, NextResponse } from 'next/server';
import { fetchAllVehicles } from '@/lib/api/vehicle-tracking.routes';
import { transformVehicleData } from '@/lib/api/transformers';

/**
 * API route handler for vehicle tracking
 * Fetches vehicles from IoT backend and transforms to frontend format
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'vehicles') {
    try {
      // Fetch vehicles from IoT backend 
      const backendData = await fetchAllVehicles();

      // Transform backend data to frontend format
      const vehicles = backendData.map(transformVehicleData);

      return NextResponse.json(
        {
          success: true,
          data: vehicles,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error fetching vehicles from IoT backend:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch vehicles: ' + (error instanceof Error ? error.message : 'Unknown error'),
        },
        { status: 500 }
      );
    }
  }

  if (action === 'trips') {
    // Trips are not yet implemented in IoT backend
    // Return empty array instead of mock data
    return NextResponse.json(
      {
        success: true,
        data: [],
      },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: 'Invalid action parameter',
    },
    { status: 400 }
  );
}