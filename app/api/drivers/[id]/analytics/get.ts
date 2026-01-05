import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { drivers, vehicles } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

interface DriverAnalyticsResponse {
  success: boolean;
  data?: {
    driverId: string;
    vehicleId: string | null;
    drivingScore: number;
    totalTrips: number;
    completedTrips: number;
    totalDistanceKm: number;
    totalDurationMinutes: number;
    violationsCount: number;
    violationsByType: Record<string, number>;
    recentViolations: Array<{
      eventId: string;
      eventType: string;
      eventTime: string;
      severity: number;
      location?: {
        latitude: number;
        longitude: number;
        speed?: number;
      };
    }>;
  };
  message?: string;
}

/**
 * Get driver analytics including driving score, violations, and trip statistics
 * Aggregates data from frontend database (trips) and IoT backend (events)
 */
export async function getDriverAnalytics(
  driverId: string,
  request?: NextRequest
): Promise<NextResponse<DriverAnalyticsResponse>> {
  try {
    // Get driver and vehicle info
    const driver = await db.query.drivers.findFirst({
      where: eq(drivers.id, driverId),
      columns: {
        id: true,
        vehicleId: true,
      },
    });

    if (!driver) {
      return NextResponse.json(
        {
          success: false,
          message: 'Driver not found',
        },
        { status: 404 }
      );
    }

    // Get all trips for this driver
    const allTrips = await db.query.trips.findMany({
      where: (trips, { or, eq }) =>
        or(eq(trips.mainDriverId, driverId), eq(trips.substituteDriverId, driverId)),
      columns: {
        id: true,
        status: true,
        actualStartTime: true,
        actualEndTime: true,
      },
    });

    const completedTrips = allTrips.filter((t) => t.status === 'completed');
    const totalTrips = allTrips.length;

    // Calculate trip statistics from completed trips
    let totalDistanceKm = 0;
    let totalDurationMinutes = 0;

    // Fetch violations from IoT backend if vehicle is assigned
    let violationsCount = 0;
    let violationsByType: Record<string, number> = {};
    let recentViolations: Array<{
      eventId: string;
      eventType: string;
      eventTime: string;
      severity: number;
      location?: {
        latitude: number;
        longitude: number;
        speed?: number;
      };
    }> = [];

    if (driver.vehicleId) {
      try {
        // Get violations from IoT backend for the last 30 days
        const iotBackendUrl = process.env.NEXT_PUBLIC_IOT_BACKEND_URL || 'http://localhost:3001';
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30); // Last 30 days

        const eventsUrl = new URL(`${iotBackendUrl}/api/events`);
        eventsUrl.searchParams.set('vehicleId', driver.vehicleId);
        eventsUrl.searchParams.set('start', startDate.toISOString());
        eventsUrl.searchParams.set('end', endDate.toISOString());

        const eventsResponse = await fetch(eventsUrl.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (eventsResponse.ok) {
          const eventsData = (await eventsResponse.json()) as {
            success: boolean;
            data: Array<{
              eventId: string;
              eventType: string;
              eventTime: string;
              severity: number;
              location?: {
                latitude: number;
                longitude: number;
                speed?: number;
              };
            }>;
            count: number;
          };

          if (eventsData.success && eventsData.data) {
            // Filter for violation types (exclude informational events)
            const violationTypes = [
              'overspeed',
              'harsh_braking',
              'harsh_acceleration',
              'harsh_turn',
              'collision_detected',
            ];

            const violations = eventsData.data.filter((e) => violationTypes.includes(e.eventType));
            violationsCount = violations.length;

            // Count by type
            violations.forEach((v) => {
              violationsByType[v.eventType] = (violationsByType[v.eventType] || 0) + 1;
            });

            // Get recent violations (last 10)
            recentViolations = violations
              .sort((a, b) => new Date(b.eventTime).getTime() - new Date(a.eventTime).getTime())
              .slice(0, 10)
              .map((v) => ({
                eventId: v.eventId,
                eventType: v.eventType,
                eventTime: v.eventTime,
                severity: v.severity,
                location: v.location,
              }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch violations from IoT backend:', error);
        // Continue without violations data
      }
    }

    // Calculate driving score (0-100)
    // Base score: 100
    // Deduct points for violations:
    // - overspeed: -5 per violation
    // - harsh_braking: -3 per violation
    // - harsh_acceleration: -3 per violation
    // - harsh_turn: -2 per violation
    // - collision_detected: -20 per violation
    let drivingScore = 100;
    drivingScore -= (violationsByType['overspeed'] || 0) * 5;
    drivingScore -= (violationsByType['harsh_braking'] || 0) * 3;
    drivingScore -= (violationsByType['harsh_acceleration'] || 0) * 3;
    drivingScore -= (violationsByType['harsh_turn'] || 0) * 2;
    drivingScore -= (violationsByType['collision_detected'] || 0) * 20;
    drivingScore = Math.max(0, Math.min(100, drivingScore)); // Clamp between 0 and 100

    return NextResponse.json(
      {
        success: true,
        data: {
          driverId: driver.id,
          vehicleId: driver.vehicleId,
          drivingScore,
          totalTrips,
          completedTrips: completedTrips.length,
          totalDistanceKm,
          totalDurationMinutes,
          violationsCount,
          violationsByType,
          recentViolations,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Driver analytics error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

