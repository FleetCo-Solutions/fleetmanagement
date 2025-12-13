/**
 * Trips API Routes
 * Functions to interact with frontend database for trips
 */

/**
 * Trip data structure
 */
export interface TripData {
  id: string;
  vehicleId: number;
  mainDriverId: number;
  assistantDriverId?: number;
  startLocation: string;
  endLocation: string;
  startTime: string;
  endTime?: string;
  status?: string;
  distanceKm?: number;
  purpose?: string;
  fuelUsed?: number;
}

/**
 * Fetch all trips from frontend database
 *
 * @returns Promise resolving to array of trips
 * @throws {Error} if API request fails
 */
export async function fetchTrips(): Promise<TripData[]> {
  try {
    const response = await fetch('/api/trips', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch trips: ${response.statusText}`);
    }

    const result = await response.json();

    // Check if trips are in dto.content format
    if (result.dto && Array.isArray(result.dto.content)) {
      return result.dto.content;
    }

    // Check if trips are directly in data format
    if (Array.isArray(result.data)) {
      return result.data;
    }

    // Return empty array if no trips found
    return [];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch trips from frontend database');
  }
}

