// Import Drizzle-generated types from schema
export type {} from "@/app/db/schema";

// Custom form types for components
export interface UserFormData {
  email: string;
  passwordHash?: string;
  firstName: string;
  lastName: string;
  phone: string;
  // departmentId: number;
  // roles: number[];
  // status: "active" | "inactive" | "suspended";
  // emergencyContacts?: {
  //   firstName: string;
  //   lastName: string;
  //   relationship: string;
  //   address: string;
  //   phone: string;
  //   email?: string;
  //   alternativeNo?: string;
  // }[];
}

export interface IUsers {
  timestamp: Date;
  statusCode: string;
  message: string;
  dto: UserContent;
}

export interface UserContent {
  content: BackendUser[];
  totalPages: number;
  totalElements: number;
}

export interface BackendUser {
  id: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  email: string;
  passwordHash: string;
  status: "active" | "inactive" | "suspended";
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}


export interface UserDetails {
  timestamp:  Date;
  statusCode: string;
  message:    string;
  dto:        UserDetail;
}

export interface UserDetail {
  profile:  UserProfile;
  activity: UserActivity;
  emergencyContacts: EmergencyContact[];
}

export interface UserActivity {
  lastLogin:  Date;
  accountAge: number;
}

export interface UserProfile {
  id:        string;
  firstName: string;
  lastName:  string;
  email:     string;
  phone:     string;
  status:    "active" | "inactive" | "suspended";
  createdAt: Date;
  updatedAt: Date;
}

export interface IDepartments {
  timestamp: Date;
  statusCode: string;
  message: string;
  dto: Department[];
}
export interface IAddUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // roles: number[];
  // departmentId: number;
}
export interface Department {
  id: number;
  name: string;
}

export interface IRoles {
  timestamp: Date;
  statusCode: string;
  message: string;
  dto: Role[];
}

export interface Role {
  id: number;
  name: string;
  description: string;
  disabled: boolean;
  createdDate: Date;
  createdBy: string;
  numberOfUsers: number;
}

export interface IDriver {
  timestamp: Date;
  statusCode: string;
  message: string;
  dto: DriverDto;
}

export interface DriverDto {
  content: Driver[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface Driver {
  id:               string;
  firstName:        string;
  lastName:         string;
  phone:            string;
  alternativePhone: string;
  licenseNumber:    string;
  licenseExpiry:    string;
  status:           string;
  passwordHash:     string;
  role:             string;
  vehicleId:        string;
  lastLogin:        Date | null;
  createdAt:        Date;
  updatedAt:        Date;
  deletedAt:        Date | null;
  vehicle?:          tempVehicle;
}

export interface IndividualDriver {
  timestamp: Date;
  message:   string;
  dto:       DriverData;
}

export interface DriverData {
  profile:  DriverProfile;
  activity: DriverActivity;
  emergencyContacts: EmergencyContact[];
}

export interface DriverActivity {
  lastLogin:  null;
  accountAge: number;
}

export interface DriverProfile {
  id:               string;
  firstName:        string;
  lastName:         string;
  phone:            string;
  alternativePhone: string;
  licenseNumber:    string;
  licenseExpiry:    Date;
  status:           "active" | "inactive" | "suspended";
}

export interface EmergencyContact {
  id:            string;
  firstName:     string;
  lastName:      string;
  relationship:  string;
  address:       string;
  phone:         string;
  email:         string;
  alternativeNo: string;
  createdAt:     Date;
  updatedAt:     null;
  userId:        null;
  driverId:      string;
}

export interface EmergencyContactPayload {
  firstName: string;
  lastName: string;
  relationship: "parent" | "spouse" | "sibling" | "friend" | "other";
  address: string;
  phone: string;
  email?: string;
  alternativeNo?: string;
  userId?: string;
  driverId?: string;
}

export interface ProfilePayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "suspended";
}

export interface DriversList {
  mesage: string;
  data:   DriverDetails[];
}

export interface DriverDetails {
  id:                string;
  firstName:         string;
  lastName:          string;
  phone:             string;
  LicenseNumber:     string;
  licenseExpiryDate: Date;
}

export interface tempVehicle {
  id:                 string;
  registrationNumber: string;
  model:              string;
  manufacturer:       string;
  vin:                string;
  color:              string;
  createdAt:          Date;
  updatedAt:          Date;
  deletedAt:          null;
}

export interface VehiclesList {
  message: string;
  data:    vehicleDetails[];
}

export interface vehicleDetails {
  id:                 string;
  registrationNumber: string;
  model:              string;
}

export interface VehicleDetailsResponse {
  timestamp: Date;
  message:   string;
  dto:       Dto;
}

export interface vehicleDetails {
  id:                 string;
  registrationNumber: string;
  model:              string;
  manufacturer:       string;
  vin:                string;
  color:              string;
  createdAt:          Date;
  updatedAt:          null;
  deletedAt:          null;
  drivers:            VehicleDriver[];
}

export interface VehicleDriver {
  id:               string;
  firstName:        string;
  lastName:         string;
  phone:            string;
  alternativePhone: string;
  licenseNumber:    string;
  licenseExpiry:    Date;
  status:           string;
  passwordHash:     string;
  role:             string;
  vehicleId:        string;
  lastLogin:        null;
  createdAt:        Date;
  updatedAt:        Date;
  deletedAt:        null;
}


export interface RoleFormData {
  name: string;
  description: string;
  permissions: string[];
  isDefault: boolean;
}

export interface VehicleFormData {
  vehicleRegNo: string;
  group: string;
  model: string;
  manufacturer: string;
  year: number;
  healthRate: number;
  costPerMonth: number;
  lastMaintenanceDate: string;
  fuelEfficiency: number;
  mileage: number;
  driverId: number;
  status: "en route" | "available" | "out of service";
  vin?: string;
  color?: string;
  fuelType?: "diesel" | "petrol" | "hybrid" | "electric";
  engineSize?: string;
  transmission?: "manual" | "automatic";
}

// Legacy types for backward compatibility (can be removed later)
export interface IVehicles {
  timestamp: Date;
  statusCode: string;
  message: string;
  dto: Dto;
}

export interface Dto {
  content: Vehicle[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}


export interface Vehicle {
  id:                 string;
  registrationNumber: string;
  model:              string;
  manufacturer:       string;
  vin:                string;
  color:              string;
  createdAt:          Date;
  updatedAt:          Date;
  deletedAt:          null;
  drivers?:            Driver[];
}



export enum Group {
  Logistics = "Logistics",
  Service = "Service",
  Transport = "Transport",
}

export enum Status {
  Available = "Available",
  InMaintenance = "In-Maintenance",
  OnTrip = "On-Trip",
}

export interface ITrips {
  timestamp: Date;
  statusCode: string;
  message: string;
  dto: TripsDto;
}

export interface TripsDto {
  content: unknown[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface Trip {
  tripId: string;
  vehicleRegNo: string;
  driver: string;
  startLocation: string;
  endLocation: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "in_progress" | "completed" | "delayed" | "cancelled";
  distance: number; // in kilometers
  duration: number; // in minutes
  fuelUsed: number; // in liters
  violations: number;
}

export interface FuelData {
  vehicleId: string;
  vehicleRegNo: string;
  driver: string;
  fuelType: "diesel" | "petrol";
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
  status: "low" | "ok" | "good";
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
  serviceType:
    | "oil_change"
    | "brakes"
    | "tires"
    | "inspection"
    | "repair"
    | "filter_change"
    | "battery"
    | "cooling_system";
  status: "good" | "due_soon" | "overdue" | "critical";
  estimatedCost: number; // TZS
  actualCost?: number; // TZS
  serviceProvider: string;
  mileage: number;
  downtime: number; // hours
  partsUsed: string[];
  notes: string;
  warrantyStatus: "active" | "expired" | "void";
  priority: "low" | "medium" | "high" | "urgent";
  completionDate?: string;
  technician: string;
  location: string;
}
