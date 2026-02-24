// Import Drizzle-generated types from schema
export type {} from "@/app/db/schema";

// Document type applicability enum
export type DocumentApplicability =
  | "driver"
  | "vehicle"
  | "trip"
  | "user"
  | "all";

export interface DocumentType {
  id: string;
  companyId: string | null;
  name: string;
  slug: string;
  description: string | null;
  appliesTo: DocumentApplicability;
  requiresExpiry: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

// Custom form types for components
export interface UserFormData {
  email: string;
  passwordHash?: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  roleIds: string[];
  status?: "active" | "inactive" | "suspended";
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
  companyId: string | null;
  firstName: string;
  lastName: string;
  phone: string | null;
  email: string;
  passwordHash: string;
  status: "active" | "inactive" | "suspended";
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
  roles?: {
    role: {
      id: string;
      name: string;
    };
  }[];
}

export interface UserDetails {
  timestamp: Date;
  statusCode: string;
  message: string;
  dto: UserDetail;
}

export interface UserDetail {
  profile: UserProfile;
  activity: UserActivity;
  emergencyContacts: EmergencyContact[];
  roles: {
    role: {
      id: string;
      name: string;
    };
  }[];
}

export interface UserActivity {
  lastLogin: Date | null;
  accountAge: number;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  status: "active" | "inactive" | "suspended";
  createdAt: Date;
  updatedAt: Date | null;
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
  phone: string | null;
  passwordHash?: string;
  roleIds?: string[];
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
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  alternativePhone: string | null;
  status: "active" | "inactive" | "suspended";
  passwordHash: string;
  role: "main" | "substitute" | null;
  vehicleId: string | null;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
  vehicle?: tempVehicle | null;
  tripCount?: number;
  documentCount?: number;
  licenseNumber?: string | null;
  licenseExpiry?: string | null;
}

export interface IndividualDriver {
  timestamp: Date;
  message: string;
  dto: DriverData;
}

export interface DriverData {
  profile: DriverProfile;
  activity: DriverActivity;
  emergencyContacts: EmergencyContact[];
  roles: {
    role: {
      id: string;
      name: string;
    };
  }[];
}

export interface DriverActivity {
  lastLogin: Date | null;
  accountAge: number;
}

export interface DriverProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  alternativePhone: string | null;
  status: "active" | "inactive" | "suspended";
}

export interface IUpdateDriver extends DriverProfile {
  roleIds?: string[];
}

export interface EmergencyContact {
  id: string;
  firstName: string;
  lastName: string;
  relationship: "parent" | "spouse" | "sibling" | "friend" | "other";
  address: string | null;
  phone: string;
  email: string | null;
  alternativeNo: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  userId: string | null;
  driverId: string | null;
  deleted: boolean | null;
  deletedAt: Date | null;
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

export interface IEditUser extends ProfilePayload {
  roleIds?: string[];
}

export interface DriversList {
  timestamp: Date;
  statusCode: string;
  message: string;
  dto: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    status: string;
  }[];
}

export interface DriverDetails {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface tempVehicle {
  id: string;
  companyId: string | null;
  registrationNumber: string;
  model: string;
  manufacturer: string;
  vin: string;
  color: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export interface VehiclesList {
  timestamp: Date;
  statusCode: string;
  message: string;
  dto: Array<{
    id: string;
    registrationNumber: string;
    model: string;
    manufacturer: string;
    assignedDriver: {
      id: string;
      firstName: string;
      lastName: string;
      role: "main" | "substitute" | null;
    } | null;
  }>;
}

export interface vehicleDetails {
  id: string;
  registrationNumber: string;
  model: string;
  manufacturer: string;
  mainDriver: Driver;
  substituteDriver: Driver;
}

export interface VehicleDetailsResponse {
  timestamp: Date;
  statusCode: string;
  message: string;
  dto: vehicleDetails;
}

export interface vehicleDetails {
  id: string;
  companyId: string | null;
  registrationNumber: string;
  model: string;
  manufacturer: string;
  vin: string;
  color: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
  drivers?: VehicleDriver[];
}

export interface VehicleDriver {
  id: string;
  companyId: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  alternativePhone: string | null;
  status: "active" | "inactive" | "suspended";
  passwordHash: string;
  role: "main" | "substitute" | null;
  vehicleId: string | null;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
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
  id: string;
  companyId: string | null;
  registrationNumber: string;
  model: string;
  manufacturer: string;
  vin: string;
  color: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
  drivers?: Driver[];
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
  content: Trips[];
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

export interface MaintenanceApiResponse {
  timestamp: Date;
  statusCode: string;
  message: string;
  dto: MaintenanceContntDto;
}

export interface MaintenanceDetailResponse {
  timestamp: Date;
  statusCode: string;
  message: string;
  dto: MaintenanceDetailDto;
}

export interface MaintenanceDetailDto {
  content: MaintenanceRecord;
}

export interface MaintenanceContntDto {
  content: MaintenanceRecord[];
  totalElements: number;
  totalPages: number;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  requestedBy?: string | null;
  driverId?: string | null;
  type: string;
  status: string;
  priority: string;
  title: string;
  description?: string | null;
  serviceProvider?: string | null;
  technician?: string | null;
  scheduledDate?: string | null;
  completedDate?: string | null;
  mileage?: string | null;
  estimatedCost?: string | null;
  actualCost?: string | null;
  downtimeHours?: string | null;
  partsUsed?: string | null;
  notes?: string | null;
  healthScoreAfter?: string | null;
  warrantyCovered: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
  vehicle?: MaintenanceVehicle;
  driver?: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  requester?: null;
}

export interface MaintenanceVehicle {
  id: string;
  registrationNumber: string;
  model: string;
  manufacturer: string;
  vin: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}

export interface TripsList {
  timestamp: Date;
  statusCode: string;
  message: string;
  dto: TripsListContent;
}

export interface TripDetails {
  timestamp: Date;
  statusCode: string;
  message: string;
  dto: TripDetailsDto;
}

export interface TripDetailsDto {
  content: Trips;
}

export interface TripsListContent {
  content: Trips[];
  totalPages: number;
  totalElements: number;
}

export interface Trips {
  id: string;
  companyId: string | null;
  vehicleId: string;
  mainDriverId: string;
  substituteDriverId: string | null;
  startLocation: string;
  endLocation: string;
  startTime: Date;
  endTime: Date | null;
  status: "scheduled" | "in_progress" | "completed" | "delayed" | "cancelled";
  distanceKm: string | null;
  fuelUsed: string | null;
  durationMinutes: string | null;
  notes: string | null;
  actualStartTime: Date | null;
  actualEndTime: Date | null;
  actualStartLocation: unknown;
  actualEndLocation: unknown;
  createdAt: Date;
  updatedAt: Date | null;
  vehicle: TripVehicle | null;
  mainDriver: TripMainDriver | null;
  substituteDriver: TripMainDriver | null;
}

export interface TripMainDriver {
  id: string;
  companyId: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  alternativePhone: string | null;
  status: "active" | "inactive" | "suspended";
  passwordHash: string;
  role: "main" | "substitute" | null;
  vehicleId: string | null;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
export interface TripVehicle {
  id: string;
  companyId: string | null;
  registrationNumber: string;
  model: string;
  manufacturer: string;
  vin: string;
  color: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  oldValues: string | null;
  newValues: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  companyId: string | null;
  actorName: string;
  actorType: string;
}

export interface AuditLogsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AuditLogsResponse {
  success: boolean;
  data: AuditLog[];
  pagination: AuditLogsPagination;
  message?: string;
}

export interface TripSummary {
  success: boolean;
  data: Data;
}

export interface Data {
  tripId: string;
  vehicleId: string;
  startTime: Date;
  endTime: Date;
  locationCount: number;
  totalDistanceKm: number;
  averageSpeedKmh: number;
  maxSpeedKmh: number;
  durationMinutes: number;
  eventsCount: number;
  violations: Violation[];
  fuelUsedLiters: number;
  route: Route[];
}

export interface Route {
  latitude: number;
  longitude: number;
  time?: Date;
  speed: number;
  heading?: number;
}

export interface Violation {
  eventId: string;
  vehicleId: string;
  eventType: string;
  eventTime: Date;
  sourceType: string;
  location: Route;
  severity: number;
  additionalData: AdditionalData;
}

export interface AdditionalData {
  additionalProp1: AdditionalProp1;
}

export interface AdditionalProp1 {}

export interface NewTripDetails {
  timestamp: Date;
  statusCode: string;
  message: string;
  dto: NewTripDetailsDto;
}

export interface NewTripDetailsDto {
  content: NewTripDetailsContent;
}

export interface NewTripDetailsContent {
  id: string;
  companyId: string;
  vehicleId: string;
  mainDriverId: string;
  substituteDriverId: null;
  startLocation: string;
  endLocation: string;
  startTime: Date;
  endTime: Date;
  status: string;
  distanceKm: null;
  fuelUsed: null;
  durationMinutes: null;
  notes: null;
  actualStartTime: Date;
  actualEndTime: null;
  actualStartLocation: ActualLocation;
  actualEndLocation: ActualLocation;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  vehicle: Vehicle;
  mainDriver: MainDriver;
  substituteDriver: null;
}

export interface ActualLocation {
  address: string;
  latitude: number;
  longitude: number;
}

export interface MainDriver {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  phone: string;
  alternativePhone: string;
  status: string;
  passwordHash: string;
  role: string;
  vehicleId: string;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}

export interface TripDetailsVehicle {
  id: string;
  companyId: string;
  registrationNumber: string;
  model: string;
  manufacturer: string;
  vin: string;
  color: string;
}
export interface FrankTripDetails {
  trip_id: string;
  driver_id: string;
  trip_safety_score: number;
  trip_safety_features: TripSafetyFeatures;
  trip_violations_risk: null | number;
  trip_violations: TripViolation[];
  trip_violations_count: number;
  trip_fuel_efficiency_kpl: null | number;
  driver_safety_score: DriverSafetyScore;
}

export interface TripSafetyFeatures {
  avg_speed: number;
  speed_std: number;
  harsh_braking_count: number;
  harsh_accel_count: number;
  idling_ratio: number;
  cornering_intensity: number;
  rpm_stress_ratio: number;
  distance_km: number;
  harsh_braking_rate: number;
  harsh_accel_rate: number;
  crash_events: number;
  speed_compliance: number;
  duration?: number; // Optional as it wasn't in JSON but user code used it
  fuelUsed?: number; // Optional as it wasn't in JSON but user code used it
}

export interface TripViolation {
  id: null | string;
  trip_id: string;
  driver_id: string;
  vehicle_id: string;
  violation_type: string;
  severity: number;
  timestamp: string;
  latitude: number;
  longitude: number;
  metadata: ViolationMetadata | null;
}

export interface ViolationMetadata {
  actual_speed?: number;
  limit?: number;
}

export interface DriverSafetyScore {
  driver_id: string;
  score: number;
  trip_count: number;
  last_updated: string;
}

export interface FrankDriverDetails {
  driver_id: string;
  safety_score: SafetyScore;
  violations: Violation[];
  violations_summary: ViolationsSummary;
}

export interface SafetyScore {
  driver_id: string;
  score: number;
  trip_count: number;
  last_updated: Date;
}

export interface Violation {
  id: null;
  trip_id: string;
  driver_id: string;
  vehicle_id: string;
  violation_type: string;
  severity: number;
  timestamp: Date;
  latitude: number;
  longitude: number;
  metadata: Metadata | null;
}

export interface Metadata {
  actual_speed: number;
  limit: number;
}

export interface ViolationsSummary {
  total_count: number;
  by_type: ByType;
  by_severity: { [key: string]: number };
}

export interface ByType {
  SPEEDING: number;
  HARSH_BRAKING: number;
}
