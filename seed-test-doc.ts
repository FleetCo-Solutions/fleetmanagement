import "dotenv/config";
import { db } from "./app/db";
import { vehicleDocuments } from "./app/db/schema";

async function run() {
  const vehicleId = "0661ffc2-be90-4506-9de3-98549dd20a42";
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);

  console.log(
    `Seeding test document for vehicle ${vehicleId} expiring on ${expiryDate.toISOString()}`,
  );

  try {
    await db.insert(vehicleDocuments).values({
      vehicleId,
      title: "Test Insurance Policy",
      description: "Automated test record for notification verification",
      documentType: "insurance",
      cloudinaryPublicId: "test/insurance-sample",
      cloudinarySecureUrl:
        "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      expiryDate: expiryDate,
      reminderConfig: {
        intervals: [30, 15, 7, 3, 1, 0],
        postExpiryDays: 7,
      },
    });

    console.log("Test document seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed test document:", error);
    process.exit(1);
  }
}

run();
