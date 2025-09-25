import { Vehicle, Trip } from '@/app/types/vehicle';

// Real coordinates for major Tanzanian cities
const CITIES = {
  darEsSalaam: { lat: -6.7924, lng: 39.2083, name: 'Dar es Salaam' },
  arusha: { lat: -3.3869, lng: 36.6830, name: 'Arusha' },
  mwanza: { lat: -2.5164, lng: 32.9173, name: 'Mwanza' },
  dodoma: { lat: -6.1630, lng: 35.7516, name: 'Dodoma' },
  tanga: { lat: -5.0694, lng: 39.0997, name: 'Tanga' },
  zanzibar: { lat: -6.1652, lng: 39.2026, name: 'Zanzibar' }
};

export const mockVehicles: Vehicle[] = [
  {
    id: 'vehicle-1',
    name: 'Delivery Truck Alpha',
    licensePlate: 'T123ABC',
    type: 'truck',
    status: 'active',
    driverId: 'driver-1',
    driverName: 'John Mwalimu',
    color: '#3B82F6',
    icon: '🚛',
    currentLocation: {
      id: 'loc-1',
      vehicleId: 'vehicle-1',
      latitude: CITIES.darEsSalaam.lat,
      longitude: CITIES.darEsSalaam.lng,
      speed: 45,
      heading: 180,
      timestamp: new Date().toISOString(),
      batteryLevel: 85,
      fuelLevel: 70,
      engineStatus: 'running',
      alertStatus: 'normal',
      address: 'Dar es Salaam City Center'
    }
  },
  {
    id: 'vehicle-2',
    name: 'Cargo Van Beta',
    licensePlate: 'T456DEF',
    type: 'van',
    status: 'active',
    driverId: 'driver-2',
    driverName: 'Sarah Kimaro',
    color: '#10B981',
    icon: '🚐',
    currentLocation: {
      id: 'loc-2',
      vehicleId: 'vehicle-2',
      latitude: CITIES.arusha.lat,
      longitude: CITIES.arusha.lng,
      speed: 35,
      heading: 90,
      timestamp: new Date().toISOString(),
      batteryLevel: 92,
      fuelLevel: 85,
      engineStatus: 'running',
      alertStatus: 'normal',
      address: 'Arusha City Center'
    }
  },
  {
    id: 'vehicle-3',
    name: 'Service Car Gamma',
    licensePlate: 'T789GHI',
    type: 'car',
    status: 'active',
    driverId: 'driver-3',
    driverName: 'Michael Mwamba',
    color: '#F59E0B',
    icon: '🚗',
    currentLocation: {
      id: 'loc-3',
      vehicleId: 'vehicle-3',
      latitude: CITIES.mwanza.lat,
      longitude: CITIES.mwanza.lng,
      speed: 25,
      heading: 270,
      timestamp: new Date().toISOString(),
      batteryLevel: 78,
      fuelLevel: 60,
      engineStatus: 'running',
      alertStatus: 'normal',
      address: 'Mwanza City Center'
    }
  },
  {
    id: 'vehicle-4',
    name: 'Transport Bus Delta',
    licensePlate: 'T012JKL',
    type: 'bus',
    status: 'active',
    driverId: 'driver-4',
    driverName: 'Grace Mwangi',
    color: '#EF4444',
    icon: '🚌',
    currentLocation: {
      id: 'loc-4',
      vehicleId: 'vehicle-4',
      latitude: CITIES.dodoma.lat,
      longitude: CITIES.dodoma.lng,
      speed: 50,
      heading: 45,
      timestamp: new Date().toISOString(),
      batteryLevel: 88,
      fuelLevel: 75,
      engineStatus: 'running',
      alertStatus: 'normal',
      address: 'Dodoma City Center'
    }
  },
  {
    id: 'vehicle-5',
    name: 'Delivery Truck Epsilon',
    licensePlate: 'T345MNO',
    type: 'truck',
    status: 'active',
    driverId: 'driver-5',
    driverName: 'David Mwangi',
    color: '#8B5CF6',
    icon: '🚛',
    currentLocation: {
      id: 'loc-5',
      vehicleId: 'vehicle-5',
      latitude: CITIES.tanga.lat,
      longitude: CITIES.tanga.lng,
      speed: 40,
      heading: 135,
      timestamp: new Date().toISOString(),
      batteryLevel: 90,
      fuelLevel: 80,
      engineStatus: 'running',
      alertStatus: 'normal',
      address: 'Tanga City Center'
    }
  }
];

export const mockTrips: Trip[] = [
  {
    id: 'trip-1',
    name: 'Dar es Salaam to Arusha',
    startLocation: {
      latitude: CITIES.darEsSalaam.lat,
      longitude: CITIES.darEsSalaam.lng,
      address: 'Dar es Salaam City Center'
    },
    endLocation: {
      latitude: CITIES.arusha.lat,
      longitude: CITIES.arusha.lng,
      address: 'Arusha City Center'
    },
    vehicleIds: ['vehicle-1'],
    status: 'completed',
    startTime: '2024-01-15T08:00:00Z',
    endTime: '2024-01-15T14:30:00Z',
    estimatedDuration: '6h 30m',
    distance: '624 km'
  },
  {
    id: 'trip-2',
    name: 'Arusha to Mwanza',
    startLocation: {
      latitude: CITIES.arusha.lat,
      longitude: CITIES.arusha.lng,
      address: 'Arusha City Center'
    },
    endLocation: {
      latitude: CITIES.mwanza.lat,
      longitude: CITIES.mwanza.lng,
      address: 'Mwanza City Center'
    },
    vehicleIds: ['vehicle-2'],
    status: 'in_progress',
    startTime: '2024-01-15T10:00:00Z',
    estimatedDuration: '4h 15m',
    distance: '385 km'
  },
  {
    id: 'trip-3',
    name: 'Mwanza to Dodoma',
    startLocation: {
      latitude: CITIES.mwanza.lat,
      longitude: CITIES.mwanza.lng,
      address: 'Mwanza City Center'
    },
    endLocation: {
      latitude: CITIES.dodoma.lat,
      longitude: CITIES.dodoma.lng,
      address: 'Dodoma City Center'
    },
    vehicleIds: ['vehicle-3'],
    status: 'planned',
    startTime: '2024-01-16T09:00:00Z',
    estimatedDuration: '3h 45m',
    distance: '312 km'
  },
  {
    id: 'trip-4',
    name: 'Dodoma to Tanga',
    startLocation: {
      latitude: CITIES.dodoma.lat,
      longitude: CITIES.dodoma.lng,
      address: 'Dodoma City Center'
    },
    endLocation: {
      latitude: CITIES.tanga.lat,
      longitude: CITIES.tanga.lng,
      address: 'Tanga City Center'
    },
    vehicleIds: ['vehicle-4'],
    status: 'completed',
    startTime: '2024-01-14T07:00:00Z',
    endTime: '2024-01-14T16:00:00Z',
    estimatedDuration: '9h 00m',
    distance: '445 km'
  },
  {
    id: 'trip-5',
    name: 'Tanga to Zanzibar',
    startLocation: {
      latitude: CITIES.tanga.lat,
      longitude: CITIES.tanga.lng,
      address: 'Tanga City Center'
    },
    endLocation: {
      latitude: CITIES.zanzibar.lat,
      longitude: CITIES.zanzibar.lng,
      address: 'Zanzibar City Center'
    },
    vehicleIds: ['vehicle-5'],
    status: 'in_progress',
    startTime: '2024-01-15T12:00:00Z',
    estimatedDuration: '2h 30m',
    distance: '180 km'
  }
];