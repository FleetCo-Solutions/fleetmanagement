import "dotenv/config";
import { db } from "../app/db/index";
import { sql } from "drizzle-orm";

async function migrate() {
    console.log("Adding new columns to vehicles table...");

    try {
        await db.execute(sql`
      ALTER TABLE "vehicles" 
      ADD COLUMN IF NOT EXISTS "engineNumber" varchar(50),
      ADD COLUMN IF NOT EXISTS "description" varchar(255),
      ADD COLUMN IF NOT EXISTS "fuelType" varchar(30),
      ADD COLUMN IF NOT EXISTS "year" varchar(4),
      ADD COLUMN IF NOT EXISTS "tankCapacity" real,
      ADD COLUMN IF NOT EXISTS "targetConsumption" real;
    `);
        console.log("Migration successful!");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        process.exit(0);
    }
}

migrate();
