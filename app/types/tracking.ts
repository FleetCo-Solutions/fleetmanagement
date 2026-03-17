export type VehicleStatus = "moving" | "idle" | "overspeed" | "offline";

export interface GPSPoint {
  lat: number;
  lng: number;
  timestamp: string;
  speed: number; // km/h
  heading: number; // 0-360
  altitude?: number;
}

export interface LiveVehicleState extends GPSPoint {
  id: string;
  name: string;
  plateNumber: string;
  status: VehicleStatus;
  ignition: boolean;
  fuelLevel?: number; // percentage
  odometer: number; // km
  engineHours: number;
  driverName?: string;
  gpsSignal: "strong" | "medium" | "weak" | "none";
  lastUpdate: string;
  geofence?: string;
  alerts: number;
  imei: string;
}

export interface HistorySegment {
  id: string;
  type: "driving" | "stop";
  startTime: string;
  endTime: string;
  durationMinutes: number;
  distanceKm: number;
  points: GPSPoint[];
  startAddress?: string;
  endAddress?: string;
  maxSpeed?: number;
  avgSpeed?: number;
  idleTimeMinutes?: number;
}

export interface TrackingEvent {
  id: string;
  type: "overspeed" | "geofence_entry" | "geofence_exit" | "harsh_braking" | "ignition_on" | "ignition_off";
  severity: "low" | "medium" | "high";
  timestamp: string;
  lat: number;
  lng: number;
  value?: string | number;
  description: string;
}

export interface TelemetrySummary {
  totalDistance: number;
  totalDrivingTime: number;
  totalIdleTime: number;
  maxSpeed: number;
  avgSpeed: number;
  fuelConsumed: number;
  stopCount: number;
  geofenceVisits: number;
}
