import { db } from "../app/db";
import { vehicles } from "../app/db/schema";
import { isNull } from "drizzle-orm";
import * as fs from 'fs';

async function test() {
  let output = "";
  try {
    output += "Testing DB connection...\n";
    const allVehicles = await db.query.vehicles.findMany({
      where: isNull(vehicles.deletedAt),
      with: {
        drivers: true
      }
    });
    output += `Found vehicles: ${allVehicles.length}\n`;
    if (allVehicles.length > 0) {
      output += `First vehicle: ${JSON.stringify(allVehicles[0], null, 2)}\n`;
    }
  } catch (error) {
    output += `DB Error: ${(error as Error).message}\n`;
    output += `Stack: ${(error as Error).stack}\n`;
  }
  fs.writeFileSync('c:/Users/HomePC/fleetmanagement/tmp/test-result.txt', output);
}

test();
