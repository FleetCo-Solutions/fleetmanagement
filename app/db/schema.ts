import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
  index,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

export const userStatusEnum = pgEnum("user_status", [
  "active",
  "inactive",
  "suspended",
]);

export const relationshipEnum = pgEnum("relationship", [
  "parent",
  "spouse",
  "sibling",
  "friend",
  "other",
]);

export const driverRoleEnum = pgEnum("driver_role", ["main", "substitute"]);

// Admin Enums
export const companyStatusEnum = pgEnum("admin_company_status", [
  "active",
  "suspended",
  "trial",
  "expired",
]);

export const systemUserRoleEnum = pgEnum("admin_system_user_role", [
  "super_admin",
  "admin",
  "support",
  "sales",
  "billing",
]);

export const systemUserStatusEnum = pgEnum("admin_system_user_status", [
  "active",
  "inactive",
  "suspended",
]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id"), // Links to admin_companies table
    firstName: varchar("first_name", { length: 50 }).notNull(),
    lastName: varchar("last_name", { length: 50 }).notNull(),
    phone: varchar("phone", { length: 20 }).unique(),
    email: varchar("email", { length: 100 }).unique().notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    status: userStatusEnum("status").default("active").notNull(),
    lastLogin: timestamp("last_login", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (user) => {
    return {
      emailIdx: index("email_idx").on(user.email),
      companyIdx: index("company_idx").on(user.companyId),
    };
  }
);

// Companies Table
export const companies = pgTable(
  "admin_companies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    status: companyStatusEnum("status").default("trial").notNull(),

    // Contact Information
    contactPerson: varchar("contact_person", { length: 255 }).notNull(),
    contactEmail: varchar("contact_email", { length: 255 }).notNull(),
    contactPhone: varchar("contact_phone", { length: 50 }).notNull(),
    country: varchar("country", { length: 100 }).notNull(),
    address: varchar("address", { length: 255 }),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    statusIdx: index("company_status_idx").on(table.status),
    emailIdx: index("company_email_idx").on(table.contactEmail),
  })
);

// System Users Table (FleetCo staff, admins, support)
export const systemUsers = pgTable(
  "admin_system_users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),

    role: systemUserRoleEnum("role").default("support").notNull(),
    department: varchar("department", { length: 100 }),
    status: systemUserStatusEnum("status").default("active").notNull(),

    phone: varchar("phone", { length: 50 }),
    avatar: varchar("avatar", { length: 255 }),

    // Permissions (can be expanded)
    permissions: varchar("permissions", { length: 1000 }), // JSON string of permissions

    lastLogin: timestamp("last_login", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    emailIdx: index("system_user_email_idx").on(table.email),
    roleIdx: index("system_user_role_idx").on(table.role),
  })
);

// Audit Logs Table (Track all admin actions)
export const auditLogs = pgTable(
  "admin_audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    systemUserId: uuid("system_user_id").references(() => systemUsers.id),
    action: varchar("action", { length: 255 }).notNull(), // e.g., "company.created", "user.suspended"
    entityType: varchar("entity_type", { length: 100 }).notNull(), // e.g., "company", "system_user"
    entityId: uuid("entity_id"),
    details: varchar("details", { length: 1000 }), // JSON string with additional details
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: varchar("user_agent", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdx: index("audit_log_user_idx").on(table.systemUserId),
    actionIdx: index("audit_log_action_idx").on(table.action),
    entityIdx: index("audit_log_entity_idx").on(
      table.entityType,
      table.entityId
    ),
  })
);

export const drivers = pgTable(
  "drivers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id"), // Links to admin_companies table
    firstName: varchar("firstName", { length: 50 }).notNull(),
    lastName: varchar("lastName", { length: 50 }).notNull(),
    phone: varchar("phoneNumber", { length: 20 }).unique().notNull(),
    alternativePhone: varchar("alternativePhone", { length: 20 }).unique(),
    licenseNumber: varchar("licenseNumber", { length: 29 }).unique().notNull(),
    licenseExpiry: varchar("licenseExpiry", { length: 15 }).notNull(),
    status: userStatusEnum("status").default("active").notNull(),
    passwordHash: varchar("passwordHash", { length: 255 })
      .default("Welcome@123")
      .notNull(),
    role: driverRoleEnum("role").default("substitute"),
    vehicleId: uuid("vehicleId"),
    lastLogin: timestamp("lastLogin", { withTimezone: true }),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }),
    deletedAt: timestamp("deletedAt", { withTimezone: true }),
  },
  (driver) => {
    return {
      licenseNumberIdx: index("licenseNumberIdx").on(driver.licenseNumber),
      companyIdx: index("drivers_company_idx").on(driver.companyId),
    };
  }
);

export const vehicles = pgTable(
  "vehicles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id"), // Links to admin_companies table
    registrationNumber: varchar("registrationNumber", { length: 15 })
      .notNull()
      .unique(),
    model: varchar("model", { length: 30 }).notNull(),
    manufacturer: varchar("manufacturer", { length: 30 }).notNull(),
    vin: varchar("vin", { length: 20 }).unique().notNull(),
    color: varchar("color", { length: 20 }).notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }),
    deletedAt: timestamp("deletedAt", { withTimezone: true }),
  },
  (vehicle) => {
    return {
      companyIdx: index("vehicles_company_idx").on(vehicle.companyId),
    };
  }
);

export const emergencyContacts = pgTable(
  "emergency_contacts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    firstName: varchar("first_name", { length: 50 }).notNull(),
    lastName: varchar("last_name", { length: 50 }).notNull(),
    relationship: relationshipEnum("relationship").notNull(),
    address: varchar("address", { length: 255 }),
    phone: varchar("phone", { length: 15 }).notNull(),
    email: varchar("email", { length: 100 }),
    alternativeNo: varchar("alternative_no", { length: 15 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    driverId: uuid("driver_id").references(() => drivers.id, {
      onDelete: "cascade",
    }),
    deleted: boolean("deleted").default(false),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => {
    return {
      userIdx: index("user_idx").on(table.userId),
      driverIdx: index("driver_idx").on(table.driverId),
    };
  }
);

export const emergencyContactsRelations = relations(
  emergencyContacts,
  ({ one }) => ({
    user: one(users, {
      fields: [emergencyContacts.userId],
      references: [users.id],
    }),
    driver: one(drivers, {
      fields: [emergencyContacts.driverId],
      references: [drivers.id],
    }),
  })
);

export const passwordResetOtps = pgTable(
  "password_reset_otps",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    systemUserId: uuid("system_user_id").references(() => systemUsers.id, {
      onDelete: "cascade",
    }),
    email: varchar("email", { length: 100 }).notNull(),
    otp: varchar("otp", { length: 6 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    verified: boolean("verified").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      emailIdx: index("otp_email_idx").on(table.email),
    };
  }
);

// Maintenance Enums
export const maintenanceTypeEnum = pgEnum("maintenance_type", [
  "preventive",
  "repair",
  "emergency",
  "inspection",
  "oil_change",
  "brakes",
  "tires",
  "battery",
  "cooling_system",
  "filter_change",
  "other",
]);

export const maintenanceStatusEnum = pgEnum("maintenance_status", [
  "pending",
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
]);

export const maintenancePriorityEnum = pgEnum("maintenance_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);

export const maintenanceRecords = pgTable(
  "maintenance_records",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id"), // Links to admin_companies table
    vehicleId: uuid("vehicle_id")
      .references(() => vehicles.id, { onDelete: "cascade" })
      .notNull(),
    requestedBy: uuid("requested_by").references(() => users.id),
    driverId: uuid("driver_id").references(() => drivers.id),
    type: maintenanceTypeEnum("type").notNull(),
    status: maintenanceStatusEnum("status").default("pending").notNull(),
    priority: maintenancePriorityEnum("priority").default("medium").notNull(),
    title: varchar("title", { length: 100 }).notNull(),
    description: varchar("description", { length: 500 }),
    serviceProvider: varchar("service_provider", { length: 100 }),
    technician: varchar("technician", { length: 100 }),
    scheduledDate: timestamp("scheduled_date", { withTimezone: true }),
    completedDate: timestamp("completed_date", { withTimezone: true }),
    mileage: varchar("mileage", { length: 20 }), // Changed to varchar to match other numeric fields if needed, or keep as integer if strictly number. Using varchar for safety or integer? Schema plan said integer. Let's stick to integer for mileage if possible, but usually mileage is number. Let's use integer.
    estimatedCost: varchar("estimated_cost", { length: 20 }), // Money often stored as decimal or integer (cents). Plan said integer. Let's use integer. Actually, existing schema uses varchar for some things? No, let's look at existing. existing doesn't have money. Let's use integer for costs (cents/smallest unit) or just integer.
    actualCost: varchar("actual_cost", { length: 20 }),
    downtimeHours: varchar("downtime_hours", { length: 10 }),
    partsUsed: varchar("parts_used", { length: 1000 }), // Simple JSON string or just text for now. Drizzle has json type.
    notes: varchar("notes", { length: 1000 }),
    healthScoreAfter: varchar("health_score_after", { length: 5 }),
    warrantyCovered: boolean("warranty_covered").default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => {
    return {
      vehicleIdx: index("maintenance_vehicle_idx").on(table.vehicleId),
      statusIdx: index("maintenance_status_idx").on(table.status),
      companyIdx: index("maintenance_company_idx").on(table.companyId),
    };
  }
);

// Trips Enum
export const tripStatusEnum = pgEnum("trip_status", [
  "scheduled",
  "in_progress",
  "completed",
  "delayed",
  "cancelled",
]);

export const trips = pgTable(
  "trips",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id"), // Links to admin_companies table
    vehicleId: uuid("vehicle_id")
      .references(() => vehicles.id, { onDelete: "cascade" })
      .notNull(),
    mainDriverId: uuid("main_driver_id")
      .references(() => drivers.id)
      .notNull(),
    substituteDriverId: uuid("substitute_driver_id").references(
      () => drivers.id
    ),
    startLocation: varchar("start_location", { length: 255 }).notNull(),
    endLocation: varchar("end_location", { length: 255 }).notNull(),
    startTime: timestamp("start_time", { withTimezone: true }).notNull(),
    endTime: timestamp("end_time", { withTimezone: true }),
    status: tripStatusEnum("status").default("scheduled").notNull(),
    distanceKm: varchar("distance_km", { length: 20 }),
    fuelUsed: varchar("fuel_used", { length: 20 }),
    durationMinutes: varchar("duration_minutes", { length: 10 }),
    notes: varchar("notes", { length: 1000 }),
    // Trip tracking fields for driver start/stop
    actualStartTime: timestamp("actual_start_time", { withTimezone: true }),
    actualEndTime: timestamp("actual_end_time", { withTimezone: true }),
    actualStartLocation: jsonb("actual_start_location"),
    actualEndLocation: jsonb("actual_end_location"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => {
    return {
      vehicleIdx: index("trip_vehicle_idx").on(table.vehicleId),
      mainDriverIdx: index("trip_main_driver_idx").on(table.mainDriverId),
      statusIdx: index("trip_status_idx").on(table.status),
      startTimeIdx: index("trip_start_time_idx").on(table.startTime),
      companyIdx: index("trips_company_idx").on(table.companyId),
    };
  }
);

export const tripsRelations = relations(trips, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [trips.vehicleId],
    references: [vehicles.id],
  }),
  mainDriver: one(drivers, {
    fields: [trips.mainDriverId],
    references: [drivers.id],
    relationName: "mainDriver",
  }),
  substituteDriver: one(drivers, {
    fields: [trips.substituteDriverId],
    references: [drivers.id],
    relationName: "substituteDriver",
  }),
}));

//Relationships
// Relation: A user has many emergency contacts
export const usersRelations = relations(users, ({ many }) => ({
  emergencyContacts: many(emergencyContacts), // user -> multiple emergencyContacts
  maintenanceRequests: many(maintenanceRecords), // user -> multiple maintenance requests
}));

// Relation: A driver has many emergency contacts

export const assignmentStatusEnum = pgEnum("assignment_status", [
  "active",
  "completed",
]);

export const vehicleAssignments = pgTable("vehicle_assignments", {
  id: uuid("id").defaultRandom().primaryKey(),
  driverId: uuid("driver_id")
    .references(() => drivers.id)
    .notNull(),
  vehicleId: uuid("vehicle_id")
    .references(() => vehicles.id)
    .notNull(),
  role: driverRoleEnum("role").notNull(),
  status: assignmentStatusEnum("status").default("active").notNull(),
  assignedAt: timestamp("assigned_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  unassignedAt: timestamp("unassigned_at", { withTimezone: true }),
  notes: varchar("notes", { length: 500 }),
});

export const vehicleAssignmentsRelations = relations(
  vehicleAssignments,
  ({ one }) => ({
    driver: one(drivers, {
      fields: [vehicleAssignments.driverId],
      references: [drivers.id],
    }),
    vehicle: one(vehicles, {
      fields: [vehicleAssignments.vehicleId],
      references: [vehicles.id],
    }),
  })
);

// Update drivers relations to include assignments
export const driversRelation = relations(drivers, ({ many, one }) => ({
  emergencyContacts: many(emergencyContacts),
  vehicle: one(vehicles, {
    fields: [drivers.vehicleId],
    references: [vehicles.id],
  }),
  maintenanceRecords: many(maintenanceRecords),
  tripsAsMain: many(trips, { relationName: "mainDriver" }),
  tripsAsSubstitute: many(trips, { relationName: "substituteDriver" }),
  assignments: many(vehicleAssignments),
}));

// Update vehicles relations to include assignments
export const vehiclesRelation = relations(vehicles, ({ many }) => ({
  drivers: many(drivers),
  maintenanceRecords: many(maintenanceRecords),
  trips: many(trips),
  assignments: many(vehicleAssignments),
}));

// New Relations
export const companiesRelations = relations(companies, ({ many }) => ({
  auditLogs: many(auditLogs),
}));

export const systemUsersRelations = relations(systemUsers, ({ many }) => ({
  auditLogs: many(auditLogs),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  systemUser: one(systemUsers, {
    fields: [auditLogs.systemUserId],
    references: [systemUsers.id],
  }),
}));
