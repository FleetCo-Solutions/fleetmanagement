-- Add company_id column to drivers table
ALTER TABLE drivers ADD COLUMN company_id UUID;

-- Add company_id column to vehicles table
ALTER TABLE vehicles ADD COLUMN company_id UUID;

-- Add company_id column to maintenance_records table
ALTER TABLE maintenance_records ADD COLUMN company_id UUID;

-- Add company_id column to trips table
ALTER TABLE trips ADD COLUMN company_id UUID;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS drivers_company_idx ON drivers(company_id);
CREATE INDEX IF NOT EXISTS vehicles_company_idx ON vehicles(company_id);
CREATE INDEX IF NOT EXISTS maintenance_company_idx ON maintenance_records(company_id);
CREATE INDEX IF NOT EXISTS trips_company_idx ON trips(company_id);

-- Display confirmation
SELECT 'company_id column and indexes added successfully to drivers, vehicles, maintenance_records, and trips tables' AS status;
