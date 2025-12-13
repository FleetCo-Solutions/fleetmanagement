import type { VehicleLocationPayload } from './vehicle-tracking.types';
import type { Vehicle, VehicleLocation } from '@/app/types/vehicle';

/**
 * TODO: Vehicle Metadata to come from vehicle database
 */
function generateVehicleMetadata(vehicleId: string): {
  type: 'truck' | 'van' | 'car' | 'bus';
  color: string;
  icon: string;
  name: string;
  licensePlate: string;
} {
  const hash = vehicleId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const absHash = Math.abs(hash);

  const types: Array<'truck' | 'van' | 'car' | 'bus'> = ['truck', 'van', 'car', 'bus'];
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  const icons = ['🚛', '🚐', '🚗', '🚌', '🚚'];

  return {
    type: types[absHash % types.length],
    color: colors[absHash % colors.length],
    icon: icons[absHash % icons.length],
    name: `Vehicle ${vehicleId.substring(0, 8)}`,
    licensePlate: `V-${vehicleId.substring(0, 6).toUpperCase()}`,
  };
}

/**
 * Transform IoT backend vehicle location payload to frontend VehicleLocation format
 *
 * @param backendData - Vehicle location payload from IoT backend
 * @returns Frontend VehicleLocation object
 */
function transformVehicleLocation(
  backendData: VehicleLocationPayload & { time?: string }
): VehicleLocation {
  // Determine engine status from IoT or mobile data
  let engineStatus: 'running' | 'idle' | 'off' = 'off';
  if (backendData.iot?.engineStatus) {
    engineStatus = backendData.iot.engineStatus;
  } else if (backendData.mobile?.isMoving) {
    engineStatus = 'running';
  } else if (backendData.location.speed && backendData.location.speed > 0) {
    engineStatus = 'running';
  }

  // Determine alert status based on various factors
  let alertStatus: 'normal' | 'warning' | 'critical' = 'normal';
  if (backendData.iot?.crashDetected) {
    alertStatus = 'critical';
  } else if (backendData.iot?.harshBraking || backendData.iot?.harshAcceleration) {
    alertStatus = 'warning';
  }

  // Get fuel level from IoT data
  const fuelLevel = backendData.iot?.fuelLevel ?? undefined;

  // Get battery level from mobile or IoT data
  const batteryLevel =
    backendData.mobile?.batteryLevel ??
    (backendData.iot?.batteryVoltage
      ? Math.round((backendData.iot.batteryVoltage / 14.4) * 100)
      : undefined);

  const timestamp = backendData.time || backendData.timestamp;

  return {
    id: `loc-${backendData.vehicleId}`,
    vehicleId: backendData.vehicleId,
    latitude: backendData.location.latitude,
    longitude: backendData.location.longitude,
    speed: backendData.location.speed ?? 0,
    heading: backendData.location.heading ?? 0,
    timestamp: typeof timestamp === 'string' ? timestamp : new Date(timestamp).toISOString(),
    batteryLevel,
    fuelLevel,
    engineStatus,
    alertStatus,
  };
}

/**
 * Transform IoT backend vehicle location payload to frontend Vehicle format
 *
 * @param backendData - Vehicle location payload from IoT backend
 * @returns Frontend Vehicle object
 */
export function transformVehicleData(
  backendData: VehicleLocationPayload & { time?: string }
): Vehicle {
  const vehicleId = backendData.vehicleId;
  const metadata = generateVehicleMetadata(vehicleId);
  const location = transformVehicleLocation(backendData);
  const timestamp = backendData.time || backendData.timestamp;

  return {
    id: vehicleId,
    name: metadata.name,
    licensePlate: metadata.licensePlate,
    type: metadata.type,
    status: 'active',
    color: metadata.color,
    icon: metadata.icon,
    currentLocation: location,
    lastUpdate: typeof timestamp === 'string' ? timestamp : new Date(timestamp).toISOString(),
  };
}


