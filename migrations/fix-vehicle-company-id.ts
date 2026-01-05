import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { vehicles } from "../app/db/schema";
import { isNull } from "drizzle-orm";

const connectionString = process.env.LOCAL_DATABASE_URL!;

async function fixVehicleCompanyIds() {
  const pool = new Pool({ connectionString });
  const db = drizzle(pool);

  try {
    console.log("Checking vehicles with null company_id...");
    
    const vehiclesWithoutCompany = await db
      .select()
      .from(vehicles)
      .where(isNull(vehicles.companyId));

    console.log(`Found ${vehiclesWithoutCompany.length} vehicles without company_id`);

    if (vehiclesWithoutCompany.length > 0) {
      // Assign to Tanzania Logistics Ltd
      const companyId = "03b37bfd-83b0-42d2-8af7-e31436cd81cb";
      
      const updated = await db
        .update(vehicles)
        .set({ companyId })
        .where(isNull(vehicles.companyId))
        .returning();

      console.log(`✅ Updated ${updated.length} vehicles with company_id: ${companyId}`);
      console.log("Updated vehicles:", updated.map(v => ({ id: v.id, registrationNumber: v.registrationNumber })));
    } else {
      console.log("✅ All vehicles already have company_id assigned");
    }

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    await pool.end();
    process.exit(1);
  }
}

fixVehicleCompanyIds();
