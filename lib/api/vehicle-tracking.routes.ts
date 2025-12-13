/**
 * Vehicle Tracking API Routes
 * Functions to interact with IoT backend vehicle tracking endpoints
 */

import { IOT_BACKEND_URL, API_ENDPOINTS, API_TIMEOUT_MS } from './config';
import type { ApiResponse, BackendVehicleLocation, ApiErrorResponse } from './types';
import type { VehicleLocationPayload } from './vehicle-tracking.types';

/**
 * Fetch all vehicles with their latest locations from IoT backend
 *
 * @returns Promise resolving to array of vehicle location payloads
 * @throws {Error} if API request fails
 */
export async function fetchAllVehicles(): Promise<VehicleLocationPayload[]> {
  const url = `${IOT_BACKEND_URL}${API_ENDPOINTS.VEHICLES}`;

  console.log('[fetchAllVehicles] Attempting to fetch from:', url);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('[fetchAllVehicles] Response status:', response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = `IoT backend returned ${response.status}: ${response.statusText}`;
      let errorBody = '';

      // Try to parse error response (RFC 7807 format)
      try {
        errorBody = await response.text();
        const errorData = JSON.parse(errorBody) as ApiErrorResponse;
        errorMessage = errorData.detail || errorMessage;
        console.error('[fetchAllVehicles] Error response:', errorData);
      } catch {
        // If error response is not JSON, use default message
        console.error('[fetchAllVehicles] Non-JSON error response:', errorBody);
      }

      throw new Error(`${errorMessage} (URL: ${url})`);
    }

    const result = (await response.json()) as ApiResponse<BackendVehicleLocation[]>;

    if (!result.success || !Array.isArray(result.data)) {
      throw new Error('Invalid response format from IoT backend');
    }

    return result.data.map((item) => ({
      vehicleId: item.vehicleId,
      source: item.source,
      timestamp: item.time || item.timestamp,
      location: item.location,
      mobile: item.mobile,
      iot: item.iot,
    }));
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout: IoT backend did not respond in time');
      }
      throw error;
    }

    throw new Error('Failed to fetch vehicles from IoT backend');
  }
}

/**
 * Fetch latest location for a specific vehicle
 *
 * @param vehicleId - UUID of the vehicle
 * @returns Promise resolving to vehicle location payload or null if not found
 * @throws {Error} if API request fails
 */
export async function fetchVehicleLatestLocation(
  vehicleId: string
): Promise<VehicleLocationPayload | null> {
  const url = `${IOT_BACKEND_URL}${API_ENDPOINTS.VEHICLE_LATEST_LOCATION(vehicleId)}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      let errorMessage = `IoT backend returned ${response.status}: ${response.statusText}`;

      try {
        const errorData = (await response.json()) as ApiErrorResponse;
        errorMessage = errorData.detail || errorMessage;
      } catch {
        // If error response is not JSON, use default message
      }

      throw new Error(errorMessage);
    }

    const result = (await response.json()) as ApiResponse<BackendVehicleLocation>;

    if (!result.success || !result.data) {
      throw new Error('Invalid response format from IoT backend');
    }

    return {
      vehicleId: result.data.vehicleId,
      source: result.data.source,
      timestamp: result.data.time || result.data.timestamp,
      location: result.data.location,
      mobile: result.data.mobile,
      iot: result.data.iot,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout: IoT backend did not respond in time');
      }
      throw error;
    }

    throw new Error('Failed to fetch vehicle latest location from IoT backend');
  }
}

/**
 * Fetch location history for a vehicle within a time range
 *
 * @param vehicleId - UUID of the vehicle
 * @param start - Start date (ISO string)
 * @param end - End date (ISO string)
 * @returns Promise resolving to array of vehicle location payloads
 * @throws {Error} if API request fails
 */
export async function fetchVehicleLocationHistory(
  vehicleId: string,
  start: string,
  end: string
): Promise<Array<VehicleLocationPayload & { time: string }>> {
  const url = `${IOT_BACKEND_URL}${API_ENDPOINTS.VEHICLE_LOCATION_HISTORY}?vehicleId=${encodeURIComponent(vehicleId)}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `IoT backend returned ${response.status}: ${response.statusText}`;

      try {
        const errorData = (await response.json()) as ApiErrorResponse;
        errorMessage = errorData.detail || errorMessage;
      } catch {
        // If error response is not JSON, use default message
      }

      throw new Error(errorMessage);
    }

    const result = (await response.json()) as ApiResponse<Array<BackendVehicleLocation>>;

    if (!result.success || !Array.isArray(result.data)) {
      throw new Error('Invalid response format from IoT backend');
    }

    return result.data.map((item) => ({
      vehicleId: item.vehicleId,
      source: item.source,
      timestamp: item.time || item.timestamp,
      location: item.location,
      mobile: item.mobile,
      iot: item.iot,
      time: item.time,
    }));
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout: IoT backend did not respond in time');
      }
      throw error;
    }

    throw new Error('Failed to fetch vehicle location history from IoT backend');
  }
}


