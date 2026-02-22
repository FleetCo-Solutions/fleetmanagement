import { postDocumentType } from "../app/api/document/type/post";
import { NextRequest } from "next/server";

const COMPANY_ID = "14ed5a34-d1ed-436b-8923-b137e76b39d2";

const SYSTEM_DOCUMENT_TYPES = [
  // Driver document types
  {
    name: "Driving License",
    slug: "license",
    description: "Government-issued driving license",
    appliesTo: "driver",
    requiresExpiry: true,
  },
  {
    name: "Training Certificate",
    slug: "certificate",
    description: "Driver training or competency certificate",
    appliesTo: "driver",
    requiresExpiry: true,
  },
  {
    name: "Medical Fitness Certificate",
    slug: "medical",
    description: "Medical fitness certificate for drivers",
    appliesTo: "driver",
    requiresExpiry: true,
  },
  {
    name: "Passport / National ID",
    slug: "passport",
    description: "Passport or national identification document",
    appliesTo: "driver",
    requiresExpiry: false,
  },

  // Vehicle document types
  {
    name: "Insurance Certificate",
    slug: "insurance",
    description: "Vehicle insurance certificate",
    appliesTo: "vehicle",
    requiresExpiry: true,
  },
  {
    name: "Vehicle Inspection",
    slug: "inspection",
    description: "Vehicle roadworthiness inspection certificate",
    appliesTo: "vehicle",
    requiresExpiry: true,
  },
  {
    name: "Vehicle Registration",
    slug: "registration",
    description: "Vehicle registration/ownership document",
    appliesTo: "vehicle",
    requiresExpiry: false,
  },

  // Universal
  {
    name: "Other",
    slug: "other",
    description: "Other document",
    appliesTo: "all",
    requiresExpiry: false,
  },
];

async function runSeed() {
  console.log("Starting seed process using POST endpoint handler...");
  let successCount = 0;
  let failCount = 0;

  for (const doc of SYSTEM_DOCUMENT_TYPES) {
    // 1. Seed as SYSTEM-WIDE (companyId = null)
    try {
      console.log(`Creating System-Wide Document Type: ${doc.name}`);
      const reqSystemCode = new NextRequest(
        "http://localhost:3000/api/document/type",
        {
          method: "POST",
          body: JSON.stringify(doc),
        },
      );
      const resSystem = await postDocumentType(reqSystemCode, null);
      if (resSystem.status === 201) {
        console.log(`✅ Success (System): ${doc.name}`);
        successCount++;
      } else {
        const err = await resSystem.json();
        console.log(`❌ Failed (System): ${doc.name}`, err);
        failCount++;
      }
    } catch (e) {
      console.log(`❌ Failed Exception (System): ${doc.name}`, e);
      failCount++;
    }

    // 2. Seed as COMPANY-SPECIFIC (companyId = COMPANY_ID)
    try {
      console.log(
        `Creating Company-Specific Document Type: ${doc.name} for ${COMPANY_ID}`,
      );
      // Add a slight variation to the slug to avoid conflicts if needed, but since it's scoped by company it's fine
      const companyDoc = { ...doc, slug: `${doc.slug}-custom` };

      const reqCompanyCode = new NextRequest(
        "http://localhost:3000/api/document/type",
        {
          method: "POST",
          body: JSON.stringify(companyDoc),
        },
      );
      const resCompany = await postDocumentType(reqCompanyCode, COMPANY_ID);
      if (resCompany.status === 201) {
        console.log(`✅ Success (Company): ${companyDoc.name}`);
        successCount++;
      } else {
        const err = await resCompany.json();
        console.log(`❌ Failed (Company): ${companyDoc.name}`, err);
        failCount++;
      }
    } catch (e) {
      console.log(`❌ Failed Exception (Company): ${doc.name}`, e);
      failCount++;
    }
  }

  console.log(
    `\nSeed Complete. Success: ${successCount}, Failed: ${failCount}`,
  );
  process.exit(0);
}

runSeed();
