import { Client } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SYSTEM_DOCUMENT_TYPES = [
  // Driver document types
  {
    name: "Driving License",
    slug: "license",
    description: "Government-issued driving license",
    applies_to: "driver",
    requires_expiry: true,
  },
  {
    name: "Training Certificate",
    slug: "certificate",
    description: "Driver training or competency certificate",
    applies_to: "driver",
    requires_expiry: true,
  },
  {
    name: "Medical Fitness Certificate",
    slug: "medical",
    description: "Medical fitness certificate for drivers",
    applies_to: "driver",
    requires_expiry: true,
  },
  {
    name: "Passport / National ID",
    slug: "passport",
    description: "Passport or national identification document",
    applies_to: "driver",
    requires_expiry: false,
  },

  // Vehicle document types
  {
    name: "Insurance Certificate",
    slug: "insurance",
    description: "Vehicle insurance certificate",
    applies_to: "vehicle",
    requires_expiry: true,
  },
  {
    name: "Vehicle Inspection",
    slug: "inspection",
    description: "Vehicle roadworthiness inspection certificate",
    applies_to: "vehicle",
    requires_expiry: true,
  },
  {
    name: "Vehicle Registration",
    slug: "registration",
    description: "Vehicle registration/ownership document",
    applies_to: "vehicle",
    requires_expiry: false,
  },

  // Universal
  {
    name: "Other",
    slug: "other",
    description: "Other document",
    applies_to: "all",
    requires_expiry: false,
  },
];

async function seedDocumentTypes() {
  const connectionString = process.env.LOCAL_DATABASE_URL;

  if (!connectionString) {
    console.error(
      "❌ Error: LOCAL_DATABASE_URL environment variable is not set",
    );
    process.exit(1);
  }

  const client = new Client({ connectionString });

  try {
    console.log("🔄 Connecting to database...");
    await client.connect();
    console.log("✅ Connected\n");

    // First, ensure the enum type exists (should be created by drizzle-kit push)
    await client.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_applicability') THEN
          CREATE TYPE document_applicability AS ENUM ('driver', 'vehicle', 'trip', 'user', 'all');
        END IF;
      END $$;
    `);

    let insertedCount = 0;
    let skippedCount = 0;

    for (const docType of SYSTEM_DOCUMENT_TYPES) {
      // Skip if already exists (by slug and null company_id = system-wide)
      const existing = await client.query(
        `SELECT id FROM document_types WHERE slug = $1 AND company_id IS NULL`,
        [docType.slug],
      );

      if (existing.rows.length > 0) {
        console.log(`⏭️  Skipping '${docType.name}' (already exists)`);
        skippedCount++;
        continue;
      }

      await client.query(
        `INSERT INTO document_types (id, name, slug, description, applies_to, requires_expiry, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4::document_applicability, $5, now())`,
        [
          docType.name,
          docType.slug,
          docType.description,
          docType.applies_to,
          docType.requires_expiry,
        ],
      );
      console.log(`✅ Inserted: ${docType.name}`);
      insertedCount++;
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Inserted: ${insertedCount}`);
    console.log(`   Skipped:  ${skippedCount}`);
    console.log(`   Total:    ${SYSTEM_DOCUMENT_TYPES.length}`);
  } catch (error) {
    console.error("❌ Failed:");
    console.error(error);
    process.exit(1);
  } finally {
    await client.end();
    console.log("\n🔌 Connection closed");
  }
}

seedDocumentTypes();
