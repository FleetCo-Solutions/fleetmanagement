import "dotenv/config";
import { db } from "../app/db/index";
import { sql } from "drizzle-orm";

async function migrate() {
    console.log("Adding missing columns to vehicles table...");

    try {
        await db.execute(sql`
            ALTER TABLE "vehicles" 
            ADD COLUMN IF NOT EXISTS "inServiceDate" timestamp with time zone,
            ADD COLUMN IF NOT EXISTS "inServiceOdometer" real,
            ADD COLUMN IF NOT EXISTS "estimatedServiceLifeMonths" varchar(10),
            ADD COLUMN IF NOT EXISTS "estimatedServiceLifeMeter" real,
            ADD COLUMN IF NOT EXISTS "estimatedResaleValue" real,
            ADD COLUMN IF NOT EXISTS "outOfServiceDate" timestamp with time zone,
            ADD COLUMN IF NOT EXISTS "outOfServiceOdometer" real;
        `);
        console.log("Migration successful!");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        process.exit(0);
    }
}

migrate();
