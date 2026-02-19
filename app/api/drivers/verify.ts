import { getDrivers } from "./get";
import { companyId } from "./test-config"; // I'll create this if needed, or just hardcode

async function verify() {
  const cid = "14ed5a34-d1ed-436b-8923-b137e76b39d2";
  console.log(`Verifying drivers for company: ${cid}`);

  try {
    const response = await getDrivers(cid);
    const data = await response.json();

    console.log("Status Code:", response.status);
    console.log("Message:", data.message);
    console.log("Total Elements:", data.dto.totalElements);

    if (data.dto.content.length > 0) {
      const driver = data.dto.content[0];
      console.log("Sample Driver:", {
        id: driver.id,
        name: `${driver.firstName} ${driver.lastName}`,
        tripCount: driver.tripCount,
        documentCount: driver.documentCount,
        vehicle: driver.vehicle ? driver.vehicle.registrationNumber : "None",
      });

      // Basic assertions
      if (typeof driver.tripCount !== "number")
        console.error("FAILED: tripCount is not a number");
      if (typeof driver.documentCount !== "number")
        console.error("FAILED: documentCount is not a number");
    } else {
      console.log("No drivers found for this company.");
    }
  } catch (error) {
    console.error("Verification failed:", error);
  }
}

verify();
