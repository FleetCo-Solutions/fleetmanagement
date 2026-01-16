/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

/**
 * IoT Backend API base URL
 * Can be overridden via NEXT_PUBLIC_IOT_BACKEND_URL environment variable
 */
export const IOT_BACKEND_URL =
  process.env.NEXT_PUBLIC_IOT_BACKEND_URL ||
  'https://coordinates.fleetcotelematics.com';

/**
 * IoT Backend WebSocket URL
 * Can be overridden via NEXT_PUBLIC_IOT_WEBSOCKET_URL environment variable
 * For production, uses wss:// (secure WebSocket) matching the HTTPS backend URL
 * 
 * Defaults to production secure WebSocket, falls back to localhost for development
 */
function getWebSocketUrl(): string {
  // Use environment variable if provided
  if (process.env.NEXT_PUBLIC_IOT_WEBSOCKET_URL) {
    return process.env.NEXT_PUBLIC_IOT_WEBSOCKET_URL;
  }
  
  // In browser, detect if we're on HTTPS and use secure WebSocket
  if (typeof window !== 'undefined') {
    return window.location.protocol === 'https:'
      ? 'wss://coordinates.fleetcotelematics.com/ws'
      : 'ws://localhost:3002/ws';
  }
  
  // Server-side: default to production
  return 'wss://coordinates.fleetcotelematics.com/ws';
}

export const IOT_WEBSOCKET_URL = getWebSocketUrl();

/**
 * API request timeout in milliseconds
 */
export const API_TIMEOUT_MS = 10000;

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  VEHICLES: '/api/analytics/vehicles',
  VEHICLE_LATEST_LOCATION: (vehicleId: string) => `/api/analytics/location/${vehicleId}/latest`,
  VEHICLE_LOCATION_HISTORY: (vehicleId: string) => `/api/analytics/location/history`,
} as const;


