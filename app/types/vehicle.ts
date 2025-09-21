export interface VehicleLocation {
  id: string;
  vehicleId: string;
  latitude: number;
  longitude: number;
  speed: number; // km/h
  heading: number; // degrees (0-360)
  timestamp: string;
  batteryLevel?: number; // percentage
  fuelLevel?: number; // percentage
  engineStatus: 'running' | 'idle' | 'off';
  alertStatus: 'normal' | 'warning' | 'critical';
  address?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  type: 'truck' | 'van' | 'car' | 'bus';
  status: 'active' | 'inactive' | 'maintenance';
  driverId?: string;
  driverName?: string;
  currentLocation?: VehicleLocation;
  lastUpdate?: string;
  color: string;
  icon: string;
}

export interface Trip {
  id: string;
  name: string;
  startLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  endLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  vehicleIds: string[];
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  startTime: string;
  endTime?: string;
  estimatedDuration?: string;
  distance?: string;
  route?: {
    latitude: number;
    longitude: number;
  }[];
}

export interface WebSocketMessage {
  type: 'vehicle_update' | 'trip_update' | 'connection_status';
  data: VehicleLocation | Trip | { status: string };
  timestamp: string;
}

