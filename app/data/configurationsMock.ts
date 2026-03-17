// ============================================================
// FleetCo — Configuration Mock Data
// ============================================================

// ─────────────────────────────────────────
// A. Device Configuration
// ─────────────────────────────────────────

export type DeviceCapability =
  | "ignition_detection"
  | "fuel_monitoring"
  | "temperature_input"
  | "driver_id_support"
  | "harsh_driving"
  | "can_bus"
  | "dashcam";

export type DeviceCategory = "GPS Tracker" | "OBD Device" | "Fuel Sensor" | "Dashcam" | "Hybrid";

export interface DeviceType {
  id: string;
  name: string;
  category: DeviceCategory;
  manufacturer: string;
  model: string;
  capabilities: DeviceCapability[];
  isActive: boolean;
  createdAt: string;
}

export interface DeviceProfile {
  id: string;
  name: string;
  description: string;
  deviceTypeId: string;
  isDefault: boolean;
  movingIntervalSec: number;
  idleIntervalSec: number;
  heartbeatIntervalSec: number;
  transmissionMode: "TCP" | "UDP" | "HTTP" | "MQTT";
  apn: string;
  simProvider: string;
  precision: "low" | "standard" | "high";
  createdAt: string;
}

export interface FirmwareVersion {
  id: string;
  version: string;
  deviceTypeId: string;
  releaseNotes: string;
  releasedAt: string;
  otaEnabled: boolean;
  rolloutGroup: "alpha" | "beta" | "stable" | "all";
  status: "active" | "deprecated" | "pending";
}

export interface DeviceAssignmentRule {
  id: string;
  name: string;
  pattern: string;
  patternType: "IMEI" | "Serial";
  bindTo: "vehicle" | "driver";
  isActive: boolean;
  createdAt: string;
}

export const mockDeviceTypes: DeviceType[] = [
  {
    id: "dt-001",
    name: "Teltonika FMB140",
    category: "GPS Tracker",
    manufacturer: "Teltonika",
    model: "FMB140",
    capabilities: ["ignition_detection", "fuel_monitoring", "harsh_driving", "can_bus"],
    isActive: true,
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "dt-002",
    name: "ULBOTECH T381",
    category: "OBD Device",
    manufacturer: "ULBOTECH",
    model: "T381",
    capabilities: ["ignition_detection", "can_bus", "driver_id_support"],
    isActive: true,
    createdAt: "2024-02-10T10:00:00Z",
  },
  {
    id: "dt-003",
    name: "Omnicomm Profi 3",
    category: "Fuel Sensor",
    manufacturer: "Omnicomm",
    model: "Profi 3",
    capabilities: ["fuel_monitoring", "temperature_input"],
    isActive: true,
    createdAt: "2024-03-01T09:00:00Z",
  },
  {
    id: "dt-004",
    name: "Samsara CM32",
    category: "Dashcam",
    manufacturer: "Samsara",
    model: "CM32",
    capabilities: ["dashcam", "harsh_driving", "driver_id_support"],
    isActive: false,
    createdAt: "2024-04-20T07:00:00Z",
  },
];

export const mockDeviceProfiles: DeviceProfile[] = [
  {
    id: "dp-001",
    name: "Standard Fleet (Moving)",
    description: "Default for city fleet operations with 30s moving interval.",
    deviceTypeId: "dt-001",
    isDefault: true,
    movingIntervalSec: 30,
    idleIntervalSec: 300,
    heartbeatIntervalSec: 3600,
    transmissionMode: "TCP",
    apn: "internet.telecom.com",
    simProvider: "Zain",
    precision: "high",
    createdAt: "2024-01-20T08:00:00Z",
  },
  {
    id: "dp-002",
    name: "Long-Haul Trucks",
    description: "Optimized for intercity trucks — lower frequency to save data.",
    deviceTypeId: "dt-001",
    isDefault: false,
    movingIntervalSec: 60,
    idleIntervalSec: 600,
    heartbeatIntervalSec: 7200,
    transmissionMode: "MQTT",
    apn: "fleet.telecom.net",
    simProvider: "STC",
    precision: "standard",
    createdAt: "2024-03-10T10:00:00Z",
  },
];

export const mockFirmwareVersions: FirmwareVersion[] = [
  {
    id: "fw-001",
    version: "3.27.04",
    deviceTypeId: "dt-001",
    releaseNotes: "Improved CAN bus parsing. Fixed idle detection bug.",
    releasedAt: "2024-12-01T00:00:00Z",
    otaEnabled: true,
    rolloutGroup: "stable",
    status: "active",
  },
  {
    id: "fw-002",
    version: "3.28.00-beta",
    deviceTypeId: "dt-001",
    releaseNotes: "Experimental: Add BLE driver ID scanning.",
    releasedAt: "2025-01-10T00:00:00Z",
    otaEnabled: false,
    rolloutGroup: "beta",
    status: "pending",
  },
];

export const mockAssignmentRules: DeviceAssignmentRule[] = [
  {
    id: "ar-001",
    name: "Riyadh Fleet IMEI Prefix",
    pattern: "35401*",
    patternType: "IMEI",
    bindTo: "vehicle",
    isActive: true,
    createdAt: "2024-05-01T00:00:00Z",
  },
  {
    id: "ar-002",
    name: "Driver ID Serial Pattern",
    pattern: "SN-DRV-*",
    patternType: "Serial",
    bindTo: "driver",
    isActive: true,
    createdAt: "2024-06-15T00:00:00Z",
  },
];

// ─────────────────────────────────────────
// B. Event & Alert Configuration
// ─────────────────────────────────────────

export type EventType =
  | "overspeed"
  | "geofence_entry"
  | "geofence_exit"
  | "harsh_braking"
  | "harsh_acceleration"
  | "ignition_on"
  | "ignition_off"
  | "fuel_theft"
  | "fuel_refill"
  | "idle_exceeded"
  | "device_offline"
  | "maintenance_due";

export type NotificationChannel = "sms" | "email" | "in_app" | "webhook" | "push";

export interface AlertChannel {
  type: NotificationChannel;
  value: string; // email, phone, webhook URL
  isEnabled: boolean;
}

export interface EventRule {
  id: string;
  name: string;
  eventType: EventType;
  isActive: boolean;
  conditions: {
    threshold?: number;
    unit?: string;
    durationSec?: number;
    timeFilter?: {
      days: string[];
      start?: string;
      end?: string;
    };
  };
  vehicleGroups: string[];
  driverGroups: string[];
  severity: "low" | "medium" | "high" | "critical";
  channels: AlertChannel[];
  escalationMinutes?: number;
  createdAt: string;
  updatedAt: string;
}

export const mockEventRules: EventRule[] = [
  {
    id: "er-001",
    name: "Highway Overspeed Alert",
    eventType: "overspeed",
    isActive: true,
    conditions: {
      threshold: 120,
      unit: "km/h",
      durationSec: 30,
      timeFilter: { days: ["monday", "tuesday", "wednesday", "thursday", "friday"] },
    },
    vehicleGroups: ["vg-highway"],
    driverGroups: [],
    severity: "critical",
    channels: [
      { type: "email", value: "fleet-mgr@fleetco.com", isEnabled: true },
      { type: "in_app", value: "", isEnabled: true },
      { type: "sms", value: "+966501234567", isEnabled: false },
    ],
    escalationMinutes: 5,
    createdAt: "2024-08-01T08:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "er-002",
    name: "Geofence Exit — Riyadh Depot",
    eventType: "geofence_exit",
    isActive: true,
    conditions: {},
    vehicleGroups: ["vg-depot-a"],
    driverGroups: [],
    severity: "medium",
    channels: [{ type: "in_app", value: "", isEnabled: true }],
    createdAt: "2024-09-10T09:00:00Z",
    updatedAt: "2024-11-20T08:00:00Z",
  },
  {
    id: "er-003",
    name: "Excessive Idling",
    eventType: "idle_exceeded",
    isActive: false,
    conditions: { threshold: 15, unit: "minutes" },
    vehicleGroups: [],
    driverGroups: ["dg-all"],
    severity: "low",
    channels: [{ type: "email", value: "ops@fleetco.com", isEnabled: true }],
    createdAt: "2024-10-05T07:00:00Z",
    updatedAt: "2024-12-01T12:00:00Z",
  },
];

// ─────────────────────────────────────────
// C. Geofence Management
// ─────────────────────────────────────────

export type GeofenceType = "circle" | "polygon" | "route";

export interface GeofenceConfig {
  id: string;
  name: string;
  type: GeofenceType;
  center?: { lat: number; lng: number };
  radiusMeters?: number;
  points?: { lat: number; lng: number }[];
  assignedVehicleGroups: string[];
  triggers: ("entry" | "exit" | "dwell")[];
  dwellTimeMinutes?: number;
  isActive: boolean;
  createdAt: string;
}

export const mockGeofences: GeofenceConfig[] = [
  {
    id: "gf-001",
    name: "Riyadh Main Depot",
    type: "circle",
    center: { lat: 24.7136, lng: 46.6753 },
    radiusMeters: 500,
    assignedVehicleGroups: ["vg-depot-a", "vg-depot-b"],
    triggers: ["entry", "exit"],
    isActive: true,
    createdAt: "2024-07-01T00:00:00Z",
  },
  {
    id: "gf-002",
    name: "Jeddah Distribution Zone",
    type: "polygon",
    points: [
      { lat: 21.5433, lng: 39.1728 },
      { lat: 21.5601, lng: 39.1910 },
      { lat: 21.5321, lng: 39.1994 },
    ],
    assignedVehicleGroups: ["vg-jeddah"],
    triggers: ["exit", "dwell"],
    dwellTimeMinutes: 30,
    isActive: true,
    createdAt: "2024-09-15T00:00:00Z",
  },
];

// ─────────────────────────────────────────
// D. Maintenance & Service Rules
// ─────────────────────────────────────────

export interface MaintenanceRule {
  id: string;
  name: string;
  triggerType: "mileage" | "engine_hours" | "date";
  triggerValue: number;
  unit: string;
  reminderBefore: number;
  assignedVehicleGroups: string[];
  autoGenerateJobCard: boolean;
  workshopId?: string;
  workshopName?: string;
  isActive: boolean;
  createdAt: string;
}

export const mockMaintenanceRules: MaintenanceRule[] = [
  {
    id: "mr-001",
    name: "Oil Change — Every 5000 KM",
    triggerType: "mileage",
    triggerValue: 5000,
    unit: "km",
    reminderBefore: 500,
    assignedVehicleGroups: ["vg-all"],
    autoGenerateJobCard: true,
    workshopName: "Al-Rashid Auto Workshop",
    isActive: true,
    createdAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "mr-002",
    name: "Annual Safety Inspection",
    triggerType: "date",
    triggerValue: 365,
    unit: "days",
    reminderBefore: 30,
    assignedVehicleGroups: ["vg-heavy"],
    autoGenerateJobCard: false,
    isActive: true,
    createdAt: "2024-02-20T00:00:00Z",
  },
];

// ─────────────────────────────────────────
// E. Data & Telemetry Settings
// ─────────────────────────────────────────

export interface TelemetrySettings {
  dataRetentionDays: number;
  rawDataEnabled: boolean;
  processedDataEnabled: boolean;
  fuelCalibrationEnabled: boolean;
  canParsingEnabled: boolean;
  customIOMapping: { inputPin: string; eventName: string; description: string }[];
}

export const mockTelemetrySettings: TelemetrySettings = {
  dataRetentionDays: 365,
  rawDataEnabled: false,
  processedDataEnabled: true,
  fuelCalibrationEnabled: true,
  canParsingEnabled: true,
  customIOMapping: [
    { inputPin: "DIN1", eventName: "panic_button", description: "Driver SOS panic button" },
    { inputPin: "DIN2", eventName: "reefer_door_open", description: "Refrigerator door sensor" },
    { inputPin: "AIN1", eventName: "temperature_input", description: "Cargo temperature sensor" },
  ],
};

// ─────────────────────────────────────────
// F. Integration Settings
// ─────────────────────────────────────────

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  scopes: string[];
  expiresAt?: string;
  lastUsed?: string;
  isActive: boolean;
  createdAt: string;
}

export interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret?: string;
  isActive: boolean;
  lastTested?: string;
  lastStatus?: "success" | "failure";
  createdAt: string;
}

export const mockApiKeys: ApiKey[] = [
  {
    id: "ak-001",
    name: "ERP Integration Key",
    key: "fc_live_sk_••••••••••••••••4f2a",
    scopes: ["trips.read", "vehicles.read", "drivers.read"],
    lastUsed: "2025-03-08T14:22:00Z",
    isActive: true,
    createdAt: "2024-10-01T00:00:00Z",
  },
  {
    id: "ak-002",
    name: "Fuel Card Sync",
    key: "fc_live_sk_••••••••••••••••9c1e",
    scopes: ["fuel.read", "fuel.write"],
    expiresAt: "2026-01-01T00:00:00Z",
    lastUsed: "2025-03-07T08:00:00Z",
    isActive: true,
    createdAt: "2024-11-15T00:00:00Z",
  },
];

export const mockWebhooks: WebhookConfig[] = [
  {
    id: "wh-001",
    name: "Overspeed to Operations Hub",
    url: "https://ops.company.com/webhooks/fleetco",
    events: ["overspeed", "geofence_exit"],
    secret: "whsec_••••••••••••••••",
    isActive: true,
    lastTested: "2025-03-01T10:00:00Z",
    lastStatus: "success",
    createdAt: "2024-12-10T00:00:00Z",
  },
];

// ─────────────────────────────────────────
// G. Branding & Localization
// ─────────────────────────────────────────

export interface BrandingSettings {
  companyName: string;
  logoUrl?: string;
  timezone: string;
  language: string;
  unitSystem: "metric" | "imperial";
  distanceUnit: "km" | "miles";
  fuelUnit: "liters" | "gallons";
  reportHeaderText: string;
  reportFooterText: string;
  primaryColor: string;
}

export const mockBrandingSettings: BrandingSettings = {
  companyName: "FleetCo Solutions Ltd.",
  timezone: "Asia/Riyadh",
  language: "en",
  unitSystem: "metric",
  distanceUnit: "km",
  fuelUnit: "liters",
  reportHeaderText: "FleetCo — Confidential Fleet Report",
  reportFooterText: "© 2025 FleetCo Solutions. All rights reserved.",
  primaryColor: "#004953",
};

// ─────────────────────────────────────────
// Audit Log for Configurations
// ─────────────────────────────────────────

export interface ConfigAuditEntry {
  id: string;
  actor: string;
  action: string;
  section: string;
  entityId: string;
  entityName: string;
  at: string;
  ipAddress: string;
}

export const mockConfigAuditLog: ConfigAuditEntry[] = [
  {
    id: "ca-001",
    actor: "Ahmed Al-Rashid",
    action: "Updated",
    section: "Event Rules",
    entityId: "er-001",
    entityName: "Highway Overspeed Alert",
    at: "2025-03-08T09:15:00Z",
    ipAddress: "192.168.1.101",
  },
  {
    id: "ca-002",
    actor: "Fatima Al-Saud",
    action: "Created",
    section: "Device Profiles",
    entityId: "dp-002",
    entityName: "Long-Haul Trucks",
    at: "2025-03-07T14:30:00Z",
    ipAddress: "192.168.1.204",
  },
  {
    id: "ca-003",
    actor: "System",
    action: "OTA Update Triggered",
    section: "Firmware",
    entityId: "fw-001",
    entityName: "v3.27.04 → Stable",
    at: "2025-03-06T02:00:00Z",
    ipAddress: "10.0.0.1",
  },
];
