/**
 * Vehicle Tracking API Types
 * Type definitions matching IoT backend domain types
 */

export type DataSource = 'mobile' | 'iot';

export interface Location {
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
}

export interface MobileData {
  batteryLevel?: number;
  networkType?: string;
  isMoving?: boolean;
}

export interface IotData {
  ignition?: boolean;
  fuelLevel?: number;
  batteryVoltage?: number;
  engineStatus?: 'running' | 'idle' | 'off';
  harshBraking?: boolean;
  harshAcceleration?: boolean;
  crashDetected?: boolean;
}

export interface VehicleLocationPayload {
  vehicleId: string;
  source: DataSource;
  timestamp: string;
  location: Location;
  tripId?: string; // Optional - only present when trip is active
  mobile?: MobileData;
  iot?: IotData;
}


