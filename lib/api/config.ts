/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

/**
 * IoT Backend API base URL
 * Can be overridden via NEXT_PUBLIC_IOT_BACKEND_URL environment variable
 */
export const IOT_BACKEND_URL =
  process.env.NEXT_PUBLIC_IOT_BACKEND_URL || 'http://localhost:3001';

/**
 * IoT Backend WebSocket URL
 * Can be overridden via NEXT_PUBLIC_IOT_WEBSOCKET_URL environment variable
 */
export const IOT_WEBSOCKET_URL =
  process.env.NEXT_PUBLIC_IOT_WEBSOCKET_URL || 'ws://localhost:3002/ws';

/**
 * API request timeout in milliseconds
 */
export const API_TIMEOUT_MS = 10000;

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  VEHICLES: '/api/analytics/vehicles',
  VEHICLE_LATEST_LOCATION: (vehicleId: string) => `/api/analytics/vehicles/${vehicleId}/latest`,
  VEHICLE_LOCATION_HISTORY: (vehicleId: string) => `/api/analytics/vehicles/${vehicleId}/history`,
} as const;


