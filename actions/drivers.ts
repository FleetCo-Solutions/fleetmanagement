'use server'

import { auth } from "@/app/auth";

export interface AddDriverPayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  alternativePhoneNumber?: string;
  licenseNumber: string;
  licenseExpiryDate: string;
}

export async function getDrivers() {
    const session = await auth();
    try {
    const response = await fetch(
      `${process.env.BACKENDBASE_URL}/v1/drivers`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.userToken}`,
        },
      }
    );
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`${result.message}`);
    }

    return result;
    }
    catch (err) {
        throw new Error((err as Error).message);
    }
}

export async function getDriverDashboard() {
    const session = await auth();
    try {
    const response = await fetch(
      `${process.env.BACKENDBASE_URL}/v1/drivers/dashboard`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.userToken}`,
        },
      }
    );
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`${result.message}`);
    }

    return result;
    }
    catch (err) {
        throw new Error((err as Error).message);
    }
}

export async function addDriver(driverData: AddDriverPayload) {
    const session = await auth();
    try {
    const response = await fetch(
      `${process.env.BACKENDBASE_URL}/v1/drivers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.userToken}`,
        },
        body: JSON.stringify({
            firstName: driverData.firstName,
            lastName: driverData.lastName,
            phoneNumber: driverData.phoneNumber,
            alternativePhoneNumber: driverData.alternativePhoneNumber,
            licenseNumber: driverData.licenseNumber,
            licenseExpiryDate: driverData.licenseExpiryDate,
            // address: driverData.address,
            // dateOfBirth: driverData.dateOfBirth,
            // assignedVehicleId: driverData.assignedVehicleId,
          }),
      }
    );

    // console.log('Data sent', JSON.stringify({
    //     firstName: driverData.firstName,
    //     lastName: driverData.lastName,
    //     phoneNumber: driverData.phoneNumber,
    //     alternativePhoneNumber: driverData.alternativePhoneNumber,
    //     licenseNumber: driverData.licenseNumber,
    //     licenseExpiryDate: driverData.licenseExpiryDate,
    //     // address: driverData.address,
    //     // dateOfBirth: driverData.dateOfBirth,
    //     // assignedVehicleId: driverData.assignedVehicleId,
    //   }))
    // console.log('user token', session?.userToken)
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to add driver");
    }
    return result;
  } catch (err) {
    throw new Error((err as Error).message);
  }
    
}