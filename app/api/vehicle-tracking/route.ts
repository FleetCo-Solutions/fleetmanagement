import { NextRequest, NextResponse } from 'next/server';
import { fetchAllVehicles } from '@/lib/api/vehicle-tracking.routes';
import { transformVehicleData, transformTripData } from '@/lib/api/transformers';
import { db } from '@/app/db';
import { trips } from '@/app/db/schema';

/**
 * API route handler for vehicle tracking
 * Fetches vehicles from IoT backend and transforms to frontend format
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  /**
   * Returns raw IoT locations in FleetMap's VehicleLocation format.
   * This is server-side so there are no CORS issues.
   */
  if (action === 'locations') {
    try {
      const backendData = await fetchAllVehicles();

      const locations = backendData.map((v) => ({
        id: `loc-${v.vehicleId}`,
        vehicleId: v.vehicleId,
        registrationNumber: `Vehicle ${v.vehicleId.slice(0, 8)}`,
        model: '-',
        manufacturer: '-',
        latitude: v.location.latitude,
        longitude: v.location.longitude,
        heading: v.location.heading ?? 0,
        speed: v.location.speed ?? 0,
        status: (v.location.speed ?? 0) > 0 ? 'moving' : 'idle',
        updatedAt: v.timestamp ?? new Date().toISOString(),
      }));

      return NextResponse.json({ success: true, data: locations }, { status: 200 });
    } catch (error) {
      console.error('Error fetching locations from IoT backend:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch locations: ' + (error instanceof Error ? error.message : 'Unknown error') },
        { status: 500 },
      );
    }
  }

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
    try {
      // Fetch all trips from frontend database
      const allTrips = await db.query.trips.findMany({
        with: {
          vehicle: true,
          mainDriver: true,
          substituteDriver: true,
        },
        orderBy: (trips, { desc }) => [desc(trips.startTime)],
      });

      // Transform database trips to frontend Trip format
      const transformedTrips = allTrips.map(transformTripData);

      return NextResponse.json(
        {
          success: true,
          data: transformedTrips,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error fetching trips from database:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch trips: ' + (error instanceof Error ? error.message : 'Unknown error'),
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    {
      success: false,
      message: 'Invalid action parameter',
    },
    { status: 400 }
  );
}