import { Client } from "pg";

async function fixDriverCompanyId() {
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

    const companyId = "03b37bfd-83b0-42d2-8af7-e31436cd81cb"; // Tanzania Logistics Ltd

    // Update all drivers with NULL company_id
    const updateResult = await client.query(
      `UPDATE drivers 
       SET company_id = $1 
       WHERE company_id IS NULL 
       RETURNING id, "firstName", "lastName", "phoneNumber", company_id`,
      [companyId]
    );

    console.log(`\n✅ Updated ${updateResult.rowCount} driver(s):`);
    updateResult.rows.forEach((driver, index) => {
      console.log(`   ${index + 1}. ${driver.firstName} ${driver.lastName} (${driver.phoneNumber})`);
      console.log(`      company_id: ${driver.company_id}`);
    });

  } catch (error) {
    console.error("❌ Failed:");
    console.error(error);
    process.exit(1);
  } finally {
    await client.end();
    console.log("\n🔌 Database connection closed");
  }
}

fixDriverCompanyId();
