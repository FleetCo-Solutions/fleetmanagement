import "dotenv/config";
import { db } from "../app/db/index";
import { sql } from "drizzle-orm";

async function migrate() {
    console.log("Adding expiryType and expiryDate columns to vehicles table...");

    try {
        await db.execute(sql`
            ALTER TABLE "vehicles" 
            ADD COLUMN IF NOT EXISTS "expiryType" varchar(20),
            ADD COLUMN IF NOT EXISTS "expiryDate" timestamp with time zone;
        `);
        console.log("Migration successful!");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        process.exit(0);
    }
}

migrate();
