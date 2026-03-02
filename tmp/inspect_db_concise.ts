import "dotenv/config";
import { db } from "../app/db/index";
import { sql } from "drizzle-orm";

async function inspect() {
    try {
        console.log("Vehicles table columns:");
        const vehiclesCols = await db.execute(sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'vehicles';
        `);
        console.log(vehiclesCols.rows.map(r => `${r.column_name}: ${r.data_type}`).join("\n"));

        console.log("\nDrivers table columns:");
        const driversCols = await db.execute(sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'drivers';
        `);
        console.log(driversCols.rows.map(r => `${r.column_name}: ${r.data_type}`).join("\n"));

    } catch (error) {
        console.error("Inspection failed:", error);
    } finally {
        process.exit(0);
    }
}

inspect();
