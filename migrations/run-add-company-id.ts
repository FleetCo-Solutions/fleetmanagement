import { Client } from "pg";
import * as fs from "fs";
import * as path from "path";

async function runMigration() {
  // Database connection using environment variable
  const connectionString = process.env.LOCAL_DATABASE_URL;

  if (!connectionString) {
    console.error("❌ Error: LOCAL_DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  const client = new Client({ connectionString });

  try {
    console.log("🔄 Connecting to database...");
    await client.connect();
    console.log("✅ Connected to database");

    // Read the SQL file
    const sqlFilePath = path.join(__dirname, "add-company-id-to-tables.sql");
    const sql = fs.readFileSync(sqlFilePath, "utf8");

    console.log("🔄 Running migration: add-company-id-to-tables.sql");
    console.log("📝 Adding company_id columns to:");
    console.log("   - drivers table");
    console.log("   - vehicles table");
    console.log("   - maintenance_records table");
    console.log("   - trips table");

    // Execute the migration
    await client.query(sql);

    console.log("✅ Migration completed successfully!");
    console.log("\n📊 Summary:");
    console.log("   ✓ Added company_id UUID columns");
    console.log("   ✓ Created indexes for performance");
    console.log("\n⚠️  Next Steps:");
    console.log("   1. Update API routes to filter by companyId");
    console.log("   2. Update server actions to filter by companyId");
    console.log("   3. Test with multiple companies");
  } catch (error) {
    console.error("❌ Migration failed:");
    console.error(error);
    process.exit(1);
  } finally {
    await client.end();
    console.log("🔌 Database connection closed");
  }
}

runMigration();
