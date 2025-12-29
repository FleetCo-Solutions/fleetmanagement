import type { VehicleLocationPayload } from './vehicle-tracking.types';
import type { Vehicle, VehicleLocation, Trip } from '@/app/types/vehicle';
import type { Trips } from '@/app/types';

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
 * Data structure from IoT backend:
 * - time: Date object (from database) or ISO string (from JSON serialization)
 * - timestamp: ISO string (from payload)
 * - location: { latitude, longitude, speed?, heading? }
 * - tripId?: string (optional, only when trip is active)
 * - iot?: { fuelLevel, engineStatus, batteryVoltage, ... }
 * - mobile?: { batteryLevel, networkType, isMoving }
 *
 * @param backendData - Vehicle location payload from IoT backend with time field
 * @returns Frontend VehicleLocation object
 */
function transformVehicleLocation(
  backendData: VehicleLocationPayload & { time?: Date | string }
): VehicleLocation {
  // Engine status: use IoT engineStatus if available, otherwise infer from mobile or speed
  let engineStatus: 'running' | 'idle' | 'off' = 'off';
  if (backendData.iot?.engineStatus) {
    engineStatus = backendData.iot.engineStatus;
  } else if (backendData.mobile?.isMoving) {
    engineStatus = 'running';
  } else if (backendData.location.speed && backendData.location.speed > 0) {
    engineStatus = 'running';
  }

  // Alert status: based on IoT crash/harsh events
  let alertStatus: 'normal' | 'warning' | 'critical' = 'normal';
  if (backendData.iot?.crashDetected) {
    alertStatus = 'critical';
  } else if (backendData.iot?.harshBraking || backendData.iot?.harshAcceleration) {
    alertStatus = 'warning';
  }

  // Fuel level: from IoT data only
  const fuelLevel = backendData.iot?.fuelLevel;

  // Battery level: from mobile data, or calculate from IoT battery voltage
  const batteryLevel =
    backendData.mobile?.batteryLevel ??
    (backendData.iot?.batteryVoltage
      ? Math.round((backendData.iot.batteryVoltage / 14.4) * 100)
      : undefined);

  // Use time field (Date or ISO string) from database, fallback to timestamp (ISO string)
  const timestamp = backendData.time instanceof Date
    ? backendData.time.toISOString()
    : typeof backendData.time === 'string'
    ? backendData.time
    : backendData.timestamp;

  return {
    id: `loc-${backendData.vehicleId}`,
    vehicleId: backendData.vehicleId,
    latitude: backendData.location.latitude,
    longitude: backendData.location.longitude,
    speed: backendData.location.speed ?? 0,
    heading: backendData.location.heading ?? 0,
    timestamp,
    batteryLevel,
    fuelLevel,
    engineStatus,
    alertStatus,
  };
}

/**
 * Transform IoT backend vehicle location payload to frontend Vehicle format
 * 
 * Data structure from IoT backend: VehicleLocationPayload & { time?: Date | string }
 *
 * @param backendData - Vehicle location payload from IoT backend with time field
 * @returns Frontend Vehicle object
 */
export function transformVehicleData(
  backendData: VehicleLocationPayload & { time?: Date | string }
): Vehicle {
  const vehicleId = backendData.vehicleId;
  const metadata = generateVehicleMetadata(vehicleId);
  const location = transformVehicleLocation(backendData);
  
  // Use time field (Date or ISO string) from database, fallback to timestamp (ISO string)
  const lastUpdate = backendData.time instanceof Date
    ? backendData.time.toISOString()
    : typeof backendData.time === 'string'
    ? backendData.time
    : backendData.timestamp;

  return {
    id: vehicleId,
    name: metadata.name,
    licensePlate: metadata.licensePlate,
    type: metadata.type,
    status: 'active',
    color: metadata.color,
    icon: metadata.icon,
    currentLocation: location,
    lastUpdate,
  };
}

/**
 * Parse location from frontend database
 * 
 * @param location - Location data from database (string address or JSONB object)
 * @returns Parsed location with coordinates and address
 */
function parseLocation(location: string | Record<string, unknown> | null): { latitude: number; longitude: number; address: string } {
  // Case 1: JSONB object (actualStartLocation/actualEndLocation from database)
  if (location && typeof location === 'object' && !Array.isArray(location)) {
    const lat = location.latitude;
    const lng = location.longitude;
    
    // Validate coordinates are numbers
    if (typeof lat === 'number' && typeof lng === 'number') {
      return {
        latitude: lat,
        longitude: lng,
        address: typeof location.address === 'string' 
          ? location.address 
          : `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      };
    }
  }

  // Case 2: String (startLocation/endLocation from database - address string)
  if (typeof location === 'string') {
    // Try to parse as JSON first (in case it's stored as JSON string)
    try {
      const parsed = JSON.parse(location);
      if (parsed && typeof parsed === 'object' && typeof parsed.latitude === 'number' && typeof parsed.longitude === 'number') {
        return {
          latitude: parsed.latitude,
          longitude: parsed.longitude,
          address: typeof parsed.address === 'string' ? parsed.address : location,
        };
      }
    } catch {
      // Not JSON - it's a plain address string
      // Note: Address strings don't contain coordinates, so we return 0,0
      // TODO: Implement geocoding service to convert address to coordinates
      return {
        latitude: 0,
        longitude: 0,
        address: location,
      };
    }
  }

  // Case 3: Null/undefined - return default
  return {
    latitude: 0,
    longitude: 0,
    address: 'Unknown Location',
  };
}

/**
 * Transform database trip to frontend Trip format
 *
 * @param dbTrip - Trip from database (Drizzle ORM result)
 * @returns Frontend Trip object
 */
export function transformTripData(dbTrip: {
  id: string;
  vehicleId: string;
  startLocation: string;
  endLocation: string;
  actualStartLocation?: unknown;
  actualEndLocation?: unknown;
  startTime: Date | string;
  endTime?: Date | string | null;
  actualStartTime?: Date | string | null;
  actualEndTime?: Date | string | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'delayed' | 'cancelled';
  distanceKm?: string | null;
  durationMinutes?: string | null;
}): Trip {
  // Parse scheduled locations (address strings)
  const scheduledStartLoc = parseLocation(dbTrip.startLocation);
  const scheduledEndLoc = parseLocation(dbTrip.endLocation);

  // Parse actual locations (JSONB objects) if available
  // JSONB fields come as unknown, need to validate before parsing
  const actualStartLoc = dbTrip.actualStartLocation && typeof dbTrip.actualStartLocation === 'object'
    ? parseLocation(dbTrip.actualStartLocation as Record<string, unknown>)
    : null;
  const actualEndLoc = dbTrip.actualEndLocation && typeof dbTrip.actualEndLocation === 'object'
    ? parseLocation(dbTrip.actualEndLocation as Record<string, unknown>)
    : null;

  // Use actual locations if available, otherwise use scheduled
  const startLoc = actualStartLoc || scheduledStartLoc;
  const endLoc = actualEndLoc || scheduledEndLoc;

  // Trip name from locations
  const tripName = `${startLoc.address} → ${endLoc.address}`;

  // Map database status to frontend format
  let tripStatus: 'planned' | 'in_progress' | 'completed' | 'cancelled' = 'planned';
  if (dbTrip.status === 'scheduled') tripStatus = 'planned';
  else if (dbTrip.status === 'in_progress') tripStatus = 'in_progress';
  else if (dbTrip.status === 'completed') tripStatus = 'completed';
  else if (dbTrip.status === 'cancelled') tripStatus = 'cancelled';

  // Convert timestamps to ISO strings
  const startTime = dbTrip.startTime instanceof Date
    ? dbTrip.startTime.toISOString()
    : typeof dbTrip.startTime === 'string'
    ? dbTrip.startTime
    : new Date(dbTrip.startTime).toISOString();

  const endTime = dbTrip.endTime
    ? (dbTrip.endTime instanceof Date
        ? dbTrip.endTime.toISOString()
        : typeof dbTrip.endTime === 'string'
        ? dbTrip.endTime
        : new Date(dbTrip.endTime).toISOString())
    : undefined;

  return {
    id: dbTrip.id,
    name: tripName,
    startLocation: startLoc,
    endLocation: endLoc,
    vehicleIds: [dbTrip.vehicleId],
    status: tripStatus,
    startTime,
    endTime,
    estimatedDuration: dbTrip.durationMinutes || undefined,
    distance: dbTrip.distanceKm || undefined,
    route: [], // Will be populated from IoT backend if needed
  };
}


