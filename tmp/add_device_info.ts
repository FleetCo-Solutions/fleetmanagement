import "dotenv/config";
import { db } from "../app/db/index";
import { sql } from "drizzle-orm";

async function migrate() {
    console.log("Adding device info columns to vehicles table...");

    try {
        await db.execute(sql`
            ALTER TABLE "vehicles" 
            ADD COLUMN IF NOT EXISTS "imei" varchar(20),
            ADD COLUMN IF NOT EXISTS "simCardNumber" varchar(20);
        `);
        console.log("Migration successful!");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        process.exit(0);
    }
}

migrate();
