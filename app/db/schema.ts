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

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    firstName: varchar("first_name", { length: 50 }).notNull(),
    lastName: varchar("last_name", { length: 50 }).notNull(),
    phone: varchar("phone", { length: 15 }).unique(),
    email: varchar("email", { length: 100 }).unique().notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).default("Welcome@123").notNull(),
    status: userStatusEnum("status").default("active").notNull(),
    lastLogin: timestamp("last_login", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (user) => {
    return {
      emailIdx: index("email_idx").on(user.email),
    };
  }
);

// export const emergencyContacts = pgTable(
//   "emergency_contacts",
//   {
//     id: uuid("id").defaultRandom().primaryKey(),
//     firstName: varchar("first_name", { length: 50 }).notNull(),
//     lastName: varchar("last_name", { length: 50 }).notNull(),
//     relationship: relationshipEnum("relationship").notNull(),
//     address: varchar("address", { length: 255 }),
//     phone: varchar("phone", { length: 15 }).notNull(),
//     email: varchar("email", { length: 100 }),
//     alternativeNo: varchar("alternative_no", { length: 15 }),
//     createdAt: timestamp("created_at", { withTimezone: true })
//       .defaultNow()
//       .notNull(),
//     updatedAt: timestamp("updated_at", { withTimezone: true })
//       .defaultNow()
//       .notNull(),
//     userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
//     // driverId: uuid("driver_id").references(() => drivers.id, {
//     //   onDelete: "cascade",
//     // }),
//   },
//   (table) => {
//     return {
//       userIdx: index("user_idx").on(table.userId),
//       // driverIdx: index("driver_idx").on(table.driverId),
//     };
//   }
// );


// //Relationships
// // Relation: A user has many emergency contacts
// export const usersRelations = relations(users, ({ many }) => ({
//   emergencyContacts: many(emergencyContacts), // user -> multiple emergencyContacts
// }));

// // Relation: An emergency contact belongs to one user
// export const emergencyContactsRelations = relations(emergencyContacts, ({ one }) => ({
//   user: one(users, {
//     fields: [emergencyContacts.userId],
//     references: [users.id],
//   }),
// }));