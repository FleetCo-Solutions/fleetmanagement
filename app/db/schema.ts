import { pgTable, uuid, varchar, text, timestamp, integer, decimal, boolean, date, jsonb, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const userStatusEnum = pgEnum('user_status', ['active', 'inactive', 'suspended'])
export const vehicleStatusEnum = pgEnum('vehicle_status', ['en_route', 'available', 'out_of_service', 'maintenance'])
export const driverStatusEnum = pgEnum('driver_status', ['active', 'inactive', 'on_leave', 'suspended'])
export const tripStatusEnum = pgEnum('trip_status', ['scheduled', 'in_progress', 'completed', 'delayed', 'cancelled'])
export const fuelTypeEnum = pgEnum('fuel_type', ['diesel', 'petrol', 'electric', 'hybrid'])
export const fuelStatusEnum = pgEnum('fuel_status', ['low', 'ok', 'good'])
export const serviceTypeEnum = pgEnum('service_type', ['oil_change', 'brakes', 'tires', 'inspection', 'repair', 'filter_change', 'battery', 'cooling_system'])
export const maintenanceStatusEnum = pgEnum('maintenance_status', ['good', 'due_soon', 'overdue', 'critical'])
export const warrantyStatusEnum = pgEnum('warranty_status', ['active', 'expired', 'void'])
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high', 'urgent'])
export const violationStatusEnum = pgEnum('violation_status', ['pending', 'paid', 'disputed', 'waived'])
export const costTypeEnum = pgEnum('cost_type', ['fuel', 'maintenance', 'insurance', 'registration', 'depreciation', 'other'])

// Users table (System users only)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 100 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  department: varchar('department', { length: 50 }),
  roleId: uuid('role_id').references(() => roles.id),
  status: userStatusEnum('status').default('active'),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Roles table
export const roles = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).unique().notNull(),
  description: text('description'),
  permissions: text('permissions').array(), // ['create', 'read', 'update', 'delete']
  isDefault: boolean('is_default').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Vehicles table
export const vehicles = pgTable('vehicles', {
  id: uuid('id').primaryKey().defaultRandom(),
  vehicleRegNo: varchar('vehicle_reg_no', { length: 20 }).unique().notNull(),
  vin: varchar('vin', { length: 17 }).unique(),
  groupName: varchar('group_name', { length: 50 }),
  status: vehicleStatusEnum('status').default('available'),
  model: varchar('model', { length: 100 }).notNull(),
  manufacturer: varchar('manufacturer', { length: 100 }).notNull(),
  year: integer('year').notNull(),
  fuelType: fuelTypeEnum('fuel_type'),
  engineSize: varchar('engine_size', { length: 20 }),
  transmission: varchar('transmission', { length: 20 }),
  color: varchar('color', { length: 30 }),
  // Removed .check() because it is not a valid method on integer builder
  healthRate: integer('health_rate'),
  costPerMonth: decimal('cost_per_month', { precision: 10, scale: 2 }),
  mileage: decimal('mileage', { precision: 10, scale: 2 }).default('0'),
  fuelEfficiency: decimal('fuel_efficiency', { precision: 5, scale: 2 }),
  lastMaintenanceDate: date('last_maintenance_date'),
  nextMaintenanceDate: date('next_maintenance_date'),
  insuranceExpiry: date('insurance_expiry'),
  registrationExpiry: date('registration_expiry'),
  safetyCertificateExpiry: date('safety_certificate_expiry'),
  emissionTestExpiry: date('emission_test_expiry'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Drivers table (No user relationship)
export const drivers = pgTable('drivers', {
  id: uuid('id').primaryKey().defaultRandom(),
  driverId: varchar('driver_id', { length: 20 }).unique().notNull(),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }).notNull(),
  email: varchar('email', { length: 100 }).unique().notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  licenseNumber: varchar('license_number', { length: 50 }).unique().notNull(),
  licenseExpiry: date('license_expiry').notNull(),
  dateOfBirth: date('date_of_birth').notNull(),
  hireDate: date('hire_date').notNull(),
  status: driverStatusEnum('status').default('active'),
  assignedVehicleId: uuid('assigned_vehicle_id').references(() => vehicles.id),
  emergencyContactName: varchar('emergency_contact_name', { length: 100 }),
  emergencyContactPhone: varchar('emergency_contact_phone', { length: 20 }),
  emergencyContactRelationship: varchar('emergency_contact_relationship', { length: 50 }),
  addressStreet: varchar('address_street', { length: 255 }),
  addressCity: varchar('address_city', { length: 100 }),
  addressPostalCode: varchar('address_postal_code', { length: 20 }),
  totalTrips: integer('total_trips').default(0),
  totalDistance: decimal('total_distance', { precision: 10, scale: 2 }).default('0'),
  safetyScore: integer('safety_score'),
  fuelEfficiencyRating: decimal('fuel_efficiency_rating', { precision: 3, scale: 1 }),
  violations: integer('violations').default(0),
  medicalCertExpiry: date('medical_cert_expiry'),
  trainingCertExpiry: date('training_cert_expiry'),
  profileImageUrl: varchar('profile_image_url', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Trips table
export const trips = pgTable('trips', {
  id: uuid('id').primaryKey().defaultRandom(),
  tripId: varchar('trip_id', { length: 20 }).unique().notNull(),
  vehicleId: uuid('vehicle_id').references(() => vehicles.id).notNull(),
  driverId: uuid('driver_id').references(() => drivers.id).notNull(),
  startLocation: varchar('start_location', { length: 255 }).notNull(),
  endLocation: varchar('end_location', { length: 255 }).notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  status: tripStatusEnum('status').default('scheduled'),
  distance: decimal('distance', { precision: 8, scale: 2 }).notNull(), // km
  duration: integer('duration'), // minutes
  fuelUsed: decimal('fuel_used', { precision: 6, scale: 2 }), // liters
  violations: integer('violations').default(0),
  routeCoordinates: jsonb('route_coordinates'), // GPS coordinates
  estimatedCost: decimal('estimated_cost', { precision: 10, scale: 2 }),
  actualCost: decimal('actual_cost', { precision: 10, scale: 2 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Fuel data table
export const fuelData = pgTable('fuel_data', {
  id: uuid('id').primaryKey().defaultRandom(),
  vehicleId: uuid('vehicle_id').references(() => vehicles.id).notNull(),
  driverId: uuid('driver_id').references(() => drivers.id).notNull(),
  fuelType: fuelTypeEnum('fuel_type').notNull(),
  currentLevel: integer('current_level'), // percentage
  lastRefuelDate: date('last_refuel_date').notNull(),
  lastRefuelAmount: decimal('last_refuel_amount', { precision: 6, scale: 2 }).notNull(), // liters
  lastRefuelCost: decimal('last_refuel_cost', { precision: 10, scale: 2 }).notNull(), // TZS
  efficiency: decimal('efficiency', { precision: 5, scale: 2 }), // km/L
  monthlyConsumption: decimal('monthly_consumption', { precision: 6, scale: 2 }), // liters
  monthlyCost: decimal('monthly_cost', { precision: 10, scale: 2 }), // TZS
  fuelWastage: decimal('fuel_wastage', { precision: 6, scale: 2 }), // liters
  totalDistance: decimal('total_distance', { precision: 10, scale: 2 }), // km
  avgSpeed: decimal('avg_speed', { precision: 5, scale: 2 }), // km/h
  status: fuelStatusEnum('status').default('ok'),
  fuelStation: varchar('fuel_station', { length: 255 }),
  nextRefuelDate: date('next_refuel_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Maintenance data table
export const maintenanceData = pgTable('maintenance_data', {
  id: uuid('id').primaryKey().defaultRandom(),
  vehicleId: uuid('vehicle_id').references(() => vehicles.id).notNull(),
  driverId: uuid('driver_id').references(() => drivers.id),
  healthScore: integer('health_score'), // 0-100
  lastServiceDate: date('last_service_date').notNull(),
  nextServiceDate: date('next_service_date').notNull(),
  serviceType: serviceTypeEnum('service_type').notNull(),
  status: maintenanceStatusEnum('status').default('good'),
  estimatedCost: decimal('estimated_cost', { precision: 10, scale: 2 }),
  actualCost: decimal('actual_cost', { precision: 10, scale: 2 }),
  serviceProvider: varchar('service_provider', { length: 255 }),
  mileage: decimal('mileage', { precision: 10, scale: 2 }),
  downtime: integer('downtime'), // hours
  partsUsed: text('parts_used').array(), // array of parts
  notes: text('notes'),
  warrantyStatus: warrantyStatusEnum('warranty_status').default('active'),
  priority: priorityEnum('priority').default('medium'),
  completionDate: date('completion_date'),
  technician: varchar('technician', { length: 100 }),
  location: varchar('location', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Vehicle locations table
export const vehicleLocations = pgTable('vehicle_locations', {
  id: uuid('id').primaryKey().defaultRandom(),
  vehicleId: uuid('vehicle_id').references(() => vehicles.id).notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 8 }).notNull(),
  longitude: decimal('longitude', { precision: 11, scale: 8 }).notNull(),
  speed: decimal('speed', { precision: 5, scale: 2 }),
  heading: decimal('heading', { precision: 5, scale: 2 }),
  engineRpm: integer('engine_rpm'),
  fuelLevel: integer('fuel_level'),
  engineTemp: decimal('engine_temp', { precision: 4, scale: 1 }),
  batteryVoltage: decimal('battery_voltage', { precision: 4, scale: 2 }),
  oilPressure: decimal('oil_pressure', { precision: 4, scale: 1 }),
  timestamp: timestamp('timestamp').defaultNow(),
})

// Costs table
export const costs = pgTable('costs', {
  id: uuid('id').primaryKey().defaultRandom(),
  vehicleId: uuid('vehicle_id').references(() => vehicles.id),
  costType: costTypeEnum('cost_type').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  description: text('description'),
  date: date('date').notNull(),
  invoiceNumber: varchar('invoice_number', { length: 100 }),
  vendor: varchar('vendor', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
})

// Violations table
export const violations = pgTable('violations', {
  id: uuid('id').primaryKey().defaultRandom(),
  driverId: uuid('driver_id').references(() => drivers.id).notNull(),
  vehicleId: uuid('vehicle_id').references(() => vehicles.id),
  tripId: uuid('trip_id').references(() => trips.id),
  violationType: varchar('violation_type', { length: 100 }).notNull(),
  description: text('description'),
  location: varchar('location', { length: 255 }),
  dateTime: timestamp('date_time').notNull(),
  fineAmount: decimal('fine_amount', { precision: 10, scale: 2 }),
  pointsDeducted: integer('points_deducted'),
  status: violationStatusEnum('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
}))

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}))

export const vehiclesRelations = relations(vehicles, ({ many, one }) => ({
  trips: many(trips),
  fuelData: many(fuelData),
  maintenanceData: many(maintenanceData),
  vehicleLocations: many(vehicleLocations),
  costs: many(costs),
  violations: many(violations),
  assignedDriver: one(drivers, {
    fields: [vehicles.id],
    references: [drivers.assignedVehicleId],
  }),
}))

export const driversRelations = relations(drivers, ({ many, one }) => ({
  trips: many(trips),
  fuelData: many(fuelData),
  maintenanceData: many(maintenanceData),
  violations: many(violations),
  assignedVehicle: one(vehicles, {
    fields: [drivers.assignedVehicleId],
    references: [vehicles.id],
  }),
}))

export const tripsRelations = relations(trips, ({ one, many }) => ({
  vehicle: one(vehicles, {
    fields: [trips.vehicleId],
    references: [vehicles.id],
  }),
  driver: one(drivers, {
    fields: [trips.driverId],
    references: [drivers.id],
  }),
  violations: many(violations),
}))

export const fuelDataRelations = relations(fuelData, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [fuelData.vehicleId],
    references: [vehicles.id],
  }),
  driver: one(drivers, {
    fields: [fuelData.driverId],
    references: [drivers.id],
  }),
}))

export const maintenanceDataRelations = relations(maintenanceData, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [maintenanceData.vehicleId],
    references: [vehicles.id],
  }),
  driver: one(drivers, {
    fields: [maintenanceData.driverId],
    references: [drivers.id],
  }),
}))

export const vehicleLocationsRelations = relations(vehicleLocations, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [vehicleLocations.vehicleId],
    references: [vehicles.id],
  }),
}))

export const costsRelations = relations(costs, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [costs.vehicleId],
    references: [vehicles.id],
  }),
}))

export const violationsRelations = relations(violations, ({ one }) => ({
  driver: one(drivers, {
    fields: [violations.driverId],
    references: [drivers.id],
  }),
  vehicle: one(vehicles, {
    fields: [violations.vehicleId],
    references: [vehicles.id],
  }),
  trip: one(trips, {
    fields: [violations.tripId],
    references: [trips.id],
  }),
}))

// Export types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Role = typeof roles.$inferSelect
export type NewRole = typeof roles.$inferInsert
export type Vehicle = typeof vehicles.$inferSelect
export type NewVehicle = typeof vehicles.$inferInsert
export type Driver = typeof drivers.$inferSelect
export type NewDriver = typeof drivers.$inferInsert
export type Trip = typeof trips.$inferSelect
export type NewTrip = typeof trips.$inferInsert
export type FuelData = typeof fuelData.$inferSelect
export type NewFuelData = typeof fuelData.$inferInsert
export type MaintenanceData = typeof maintenanceData.$inferSelect
export type NewMaintenanceData = typeof maintenanceData.$inferInsert
export type VehicleLocation = typeof vehicleLocations.$inferSelect
export type NewVehicleLocation = typeof vehicleLocations.$inferInsert
export type Cost = typeof costs.$inferSelect
export type NewCost = typeof costs.$inferInsert
export type Violation = typeof violations.$inferSelect
export type NewViolation = typeof violations.$inferInsert 