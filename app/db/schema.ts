import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
  index,
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

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    firstName: varchar("first_name", { length: 50 }).notNull(),
    lastName: varchar("last_name", { length: 50 }).notNull(),
    phone: varchar("phone", { length: 20 }).unique(),
    email: varchar("email", { length: 100 }).unique().notNull(),
    passwordHash: varchar("password_hash", { length: 255 })
      .default("Welcome@123")
      .notNull(),
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
    };
  }
);

export const drivers = pgTable(
  "drivers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
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
    role: driverRoleEnum("role").default("substitute").notNull(),
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
    };
  }
);

export const vehicles = pgTable(
  "vehicles", 
  {
  id: uuid("id").defaultRandom().primaryKey(),
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
});

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
  },
  (table) => {
    return {
      userIdx: index("user_idx").on(table.userId),
      driverIdx: index("driver_idx").on(table.driverId),
    };
  }
);

//Relationships
// Relation: A user has many emergency contacts
export const usersRelations = relations(users, ({ many }) => ({
  emergencyContacts: many(emergencyContacts), // user -> multiple emergencyContacts
}));

// Relation: A driver has many emergency contacts
export const driversRelation = relations(drivers, ({ many, one }) => ({
  emergencyContacts: many(emergencyContacts), // driver -> multiple emergencyContacts
  vehicle: one(vehicles, {
    fields: [drivers.vehicleId],
    references: [vehicles.id],
  }),
}));

// Relation: A vehicle has many drivers
export const vehiclesRelation = relations(vehicles, ({ many }) => ({
  drivers: many(drivers), //vehicle -> multiple drivers
}));

// Relation: An emergency contact belongs to one user or driver
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
