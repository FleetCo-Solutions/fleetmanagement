import { Client } from "pg";

async function assignCompanyToUsers() {
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

    // Get Tanzania Logistics Ltd company ID (created in portal)
    const companyQuery = await client.query(
      "SELECT id, name FROM admin_companies WHERE name = 'Tanzania Logistics Ltd' LIMIT 1"
    );

    if (companyQuery.rows.length === 0) {
      console.error("❌ Company 'Tanzania Logistics Ltd' not found");
      console.log("💡 Create a company in fleet-management-portal first");
      process.exit(1);
    }

    const companyId = companyQuery.rows[0].id;
    const companyName = companyQuery.rows[0].name;

    console.log(`\n📍 Found company: ${companyName}`);
    console.log(`   Company ID: ${companyId}`);

    // Update all users without company_id to belong to this company
    const updateResult = await client.query(
      `UPDATE users 
       SET company_id = $1 
       WHERE company_id IS NULL 
       RETURNING id, email, first_name, last_name`,
      [companyId]
    );

    console.log(`\n✅ Assigned ${updateResult.rowCount} users to ${companyName}:`);
    updateResult.rows.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.first_name} ${user.last_name} (${user.email})`);
    });

    console.log("\n⚠️  IMPORTANT: You need to log out and log in again to get the updated session");
    console.log("   The backend API should now return companyId in the login response");

  } catch (error) {
    console.error("❌ Migration failed:");
    console.error(error);
    process.exit(1);
  } finally {
    await client.end();
    console.log("\n🔌 Database connection closed");
  }
}

assignCompanyToUsers();
