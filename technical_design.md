# Configuration System Technical Design

## 1. Database Schema Suggestions (Drizzle ORM / PostgreSQL)

Based on the multi-tenant architecture, all tables include `company_id`.

```typescript
// Device Configuration
export const deviceTypes = pgTable("device_types", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").references(() => companies.id),
  name: varchar("name", { length: 100 }).notNull(), // e.g., "Teltonika FMB140"
  category: varchar("category", { length: 50 }).notNull(), // GPS Tracker, OBD, etc.
  capabilities: jsonb("capabilities").$type<string[]>().notNull(), // ["ignition", "fuel", "temp"]
  createdAt: timestamp("created_at").defaultNow(),
});

export const deviceProfiles = pgTable("device_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").references(() => companies.id),
  name: varchar("name", { length: 100 }).notNull(),
  config: jsonb("config").notNull(), // Nested JSON for intervals, transmission mode, etc.
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Event & Alert Rules
export const eventRules = pgTable("event_rules", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").references(() => companies.id),
  name: varchar("name", { length: 100 }).notNull(),
  eventType: varchar("event_type").notNull(), // "overspeed", "geofence_exit"
  conditions: jsonb("conditions").notNull(), // Rule logic
  actions: jsonb("actions").notNull(), // Notifications, Webhooks
  targetGroups: jsonb("target_groups"), // vehicle_groups, driver_groups
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Geofencing
export const geofences = pgTable("geofences", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").references(() => companies.id),
  name: varchar("name", { length: 100 }).notNull(),
  type: varchar("type").notNull(), // "circle", "polygon", "route"
  geometry: jsonb("geometry").notNull(), // GeoJSON or custom points
  createdAt: timestamp("created_at").defaultNow(),
});
```

## 2. API Endpoints Structure (RESTful)

- `GET /api/configurations/devices/types` - List device types
- `POST /api/configurations/devices/profiles` - Create profile
- `GET /api/configurations/events/rules` - List rules
- `POST /api/configurations/events/rules/:id/test` - Trigger mock test for rule
- `GET /api/configurations/branding` - Get company branding settings

## 3. Sample JSON Configurations

### Overspeed Rule
```json
{
  "name": "Highway Overspeed Alert",
  "eventType": "overspeed",
  "conditions": {
    "speedThreshold": 80,
    "unit": "km/h",
    "durationSeconds": 120,
    "timeFilter": {
      "days": ["monday", "tuesday", "wednesday", "thursday", "friday"],
      "start": "08:00",
      "end": "18:00"
    }
  },
  "actions": [
    { "type": "email", "recipient": "fleet-mgr@company.com" },
    { "type": "webhook", "url": "https://api.company.com/alerts" }
  ]
}
```

### Device Profile
```json
{
  "name": "Standard Fleet Profile",
  "reporting": {
    "movingInterval": 30,
    "idleInterval": 300,
    "heartbeat": 3600
  },
  "transmission": {
    "mode": "TCP",
    "apn": "internet.telecom.com"
  },
  "precision": "high"
}
```

## 4. Scalable Event Rule Engine Design

- **Microservice-ready**: Decouple the Rule Engine from the API.
- **Ingestion**: Raw telemetry from Flespi/MQTT flows into a Message Queue (Kafka/RabbitMQ).
- **Processing**: A pool of Rule Workers evaluates incoming messages against `event_rules` stored in a Redis cache for fast lookup.
- **Notification**: Alerts are pushed to a Notification Service that handles SMS/Email/Webhooks.
