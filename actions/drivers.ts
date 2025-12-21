"use server";

import { AssignDriverRequestBody } from "@/app/api/drivers/assignDriver/post";

export interface AddDriverPayload {
  firstName: string;
  lastName: string;
  phone: string;
  alternativePhone?: string;
  licenseNumber: string;
  licenseExpiry: string;
}

export async function getDrivers() {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/drivers`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${session?.userToken}`,
        },
      }
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(`${result.message}`);
    }

    return result;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function getDriversList() {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/drivers/driversList`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch drivers list");
    }
    return result;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function getDriverDetails(id: string) {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/drivers/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch driver details");
    }
    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function assignDriverToVehicle(payload: AssignDriverRequestBody) {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/drivers/assignDriver`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          driverId: payload.driverId,
          vehicleId: payload.vehicleId,
          role: payload.role,
        }),
      }
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to assign driver to vehicle");
    }
    return result;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function unassignDriver(driverId: string) {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/drivers/unassignDriver`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ driverId }),
      }
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to unassign driver");
    }
    return result;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function getDriverDashboard() {
  try {
    const response = await fetch(
      `${process.env.BACKENDBASE_URL}/v1/drivers/dashboard`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(`${result.message}`);
    }

    return result;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function addDriver(driverData: AddDriverPayload) {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/drivers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${session?.userToken}`,
        },
        body: JSON.stringify({
          firstName: driverData.firstName,
          lastName: driverData.lastName,
          phone: driverData.phone,
          alternativePhone: driverData.alternativePhone,
          licenseNumber: driverData.licenseNumber,
          licenseExpiry: driverData.licenseExpiry,
        }),
      }
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to add driver");
    }
    return result;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export interface UpdateDriverPayload {
  firstName: string;
  lastName: string;
  phone: string;
  alternativePhone?: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: "active" | "inactive" | "suspended";
}

export async function updateDriver(
  id: string,
  driverData: UpdateDriverPayload
) {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/drivers/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(driverData),
      }
    );
    const result = await response.json();

    return result;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function getDriverVehicleHistory(id: string) {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/drivers/${id}/vehicle-history`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch vehicle history");
    }
    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getDriverTrips(id: string) {
  try {
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/drivers/${id}/trips`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch driver trips");
    }
    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
