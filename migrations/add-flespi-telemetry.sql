-- Migration: Add flespi_ident to vehicles and create vehicle_telemetry table
-- Run this manually against your Neon DB.
-- This ONLY adds new things — it does NOT drop or alter any existing columns.

-- 1. Add flespi_ident column to vehicles table
ALTER TABLE vehicles
  ADD COLUMN IF NOT EXISTS flespi_ident VARCHAR(50);

-- 2. Add unique constraint on flespi_ident (allows NULLs, only enforces uniqueness for non-null values)
CREATE UNIQUE INDEX IF NOT EXISTS vehicles_flespi_ident_unique
  ON vehicles (flespi_ident)
  WHERE flespi_ident IS NOT NULL;

-- 3. Add index for fast lookups
CREATE INDEX IF NOT EXISTS vehicles_flespi_ident_idx
  ON vehicles (flespi_ident);

-- 4. Create the vehicle_telemetry table
CREATE TABLE IF NOT EXISTS vehicle_telemetry (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id          UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  company_id          UUID REFERENCES admin_companies(id) ON DELETE SET NULL,
  flespi_ident        VARCHAR(50) NOT NULL,
  recorded_at         TIMESTAMPTZ NOT NULL,
  server_recorded_at  TIMESTAMPTZ,
  latitude            DOUBLE PRECISION,
  longitude           DOUBLE PRECISION,
  speed               REAL,
  direction           REAL,
  altitude            REAL,
  hdop                REAL,
  satellites          REAL,
  position_valid      BOOLEAN,
  ignition            BOOLEAN,
  movement            BOOLEAN,
  mileage             DOUBLE PRECISION,
  external_voltage    REAL,
  battery_voltage     REAL,
  gsm_signal          REAL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Indexes on vehicle_telemetry for query performance
CREATE INDEX IF NOT EXISTS telemetry_vehicle_idx        ON vehicle_telemetry (vehicle_id);
CREATE INDEX IF NOT EXISTS telemetry_recorded_at_idx    ON vehicle_telemetry (recorded_at DESC);
CREATE INDEX IF NOT EXISTS telemetry_flespi_ident_idx   ON vehicle_telemetry (flespi_ident);
CREATE INDEX IF NOT EXISTS telemetry_company_idx        ON vehicle_telemetry (company_id);
