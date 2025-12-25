/**
 * API Types
 * Type definitions for API requests and responses
 */

import type { VehicleLocationPayload } from './vehicle-tracking.types';

/**
 * IoT Backend API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}

/**
 * Vehicle location data from IoT backend
 */
export interface BackendVehicleLocation extends VehicleLocationPayload {
  time: string;
}

/**
 * Error response from API
 */
export interface ApiErrorResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
}


