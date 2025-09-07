// Import Drizzle-generated types from schema
export type {

} from '@/app/db/schema';

// Custom form types for components
export interface UserFormData {
  email: string;
  passwordHash?: string;
  firstName: string;
  lastName: string;
  phone: string;
  departmentId: number;
  roles: number[];
  status: 'active' | 'inactive' | 'suspended';
}


export interface IUsers {
  timestamp:  Date;
  statusCode: string;
  message:    string;
  dto:        UserContent;
}

export interface UserContent {
  content:       BackendUser[];
  totalPages:    number;
  totalElements: number;
}

export interface BackendUser {
  id?:            number;
  name:           string;
  email:          string;
  phone:          string;
  status:         string;
  roles:          string[];
  departmentData: Department;
}
export interface IDepartments {
  timestamp:  Date;
  statusCode: string;
  message:    string;
  dto:        Department[];
}
export interface IAddUser {
  name:         string;
  email:        string;
  phone:        string;
  roles:        number[];
  departmentId: number;
}
export interface Department {
  id:   number;
  name: string;
}

export interface IRoles {
  timestamp:  Date;
  statusCode: string;
  message:    string;
  dto:        Role[];
}

export interface Role {
  id:          number;
  name:        string;
}

export interface IDriver {
  driverId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  dateOfBirth: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'on_leave' | 'suspended';
  assignedVehicle?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  address: {
    street: string;
    city: string;
    postalCode: string;
  };
  totalTrips: number;
  totalDistance: number;
  safetyScore: number;
  fuelEfficiencyRating: number;
  violations: number;
  medicalCertExpiry: string;
  trainingCertExpiry: string;
  profileImage?: string;
}



export interface RoleFormData {
  name: string;
  description: string;
  permissions: string[];
  isDefault: boolean;
}

// Legacy types for backward compatibility (can be removed later)
export interface Vehicle {
    vehicleRegNo: string
    group: string
    status: 'en route' | 'available' | 'out of service'
    model: string
    healthRate: number
    costPerMonth: number
    driver: string
    lastMaintenance: string
    fuelEfficiency: number
    mileage: number
    year: number
    manufacturer: string
  }

export interface Trip {
  tripId: string;
  vehicleRegNo: string;
  driver: string;
  startLocation: string;
  endLocation: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'delayed' | 'cancelled';
  distance: number; // in kilometers
  duration: number; // in minutes
  fuelUsed: number; // in liters
  violations: number;
}

export interface FuelData {
  vehicleId: string;
  vehicleRegNo: string;
  driver: string;
  fuelType: 'diesel' | 'petrol';
  currentLevel: number; // percentage
  lastRefuelDate: string;
  lastRefuelAmount: number; // liters
  lastRefuelCost: number; // TZS
  efficiency: number; // km/L
  monthlyConsumption: number; // liters
  monthlyCost: number; // TZS
  fuelWastage: number; // liters wasted
  totalDistance: number; // km
  avgSpeed: number; // km/h
  status: 'low' | 'ok' | 'good';
  fuelStation: string;
  nextRefuelDate: string;
}

export interface MaintenanceData {
  vehicleId: string;
  vehicleRegNo: string;
  driver: string;
  healthScore: number; // 0-100
  lastServiceDate: string;
  nextServiceDate: string;
  serviceType: 'oil_change' | 'brakes' | 'tires' | 'inspection' | 'repair' | 'filter_change' | 'battery' | 'cooling_system';
  status: 'good' | 'due_soon' | 'overdue' | 'critical';
  estimatedCost: number; // TZS
  actualCost?: number; // TZS
  serviceProvider: string;
  mileage: number;
  downtime: number; // hours
  partsUsed: string[];
  notes: string;
  warrantyStatus: 'active' | 'expired' | 'void';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  completionDate?: string;
  technician: string;
  location: string;
}