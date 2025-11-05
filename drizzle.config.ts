import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./app/db/schema.ts",  // Path to your schema file
  out: "./drizzle",              // Where migrations will be stored
  dbCredentials: {
    url: process.env.LOCAL_DATABASE_URL!,
  },
});
