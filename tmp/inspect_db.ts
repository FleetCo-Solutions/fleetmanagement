import "dotenv/config";
import { db } from "../app/db/index";
import { sql } from "drizzle-orm";

async function inspect() {
    try {
        console.log("Inspecting vehicles table columns...");
        const vehiclesCols = await db.execute(sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'vehicles';
        `);
        console.log("Vehicles Columns:", JSON.stringify(vehiclesCols, null, 2));

        console.log("\nInspecting drivers table columns...");
        const driversCols = await db.execute(sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'drivers';
        `);
        console.log("Drivers Columns:", JSON.stringify(driversCols, null, 2));

    } catch (error) {
        console.error("Inspection failed:", error);
    } finally {
        process.exit(0);
    }
}

inspect();
