import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.LOCAL_DATABASE_URL;

if (!connectionString) {
  console.warn("LOCAL_DATABASE_URL is not set");
}

const pool = new Pool({
  connectionString,
  ssl: connectionString?.includes("supabase")
    ? { rejectUnauthorized: false }
    : false,
});

export const db = drizzle(pool, { schema });
