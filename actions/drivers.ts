"use server";

import type {
  IDriver,
  DriverDetails,
  DriversList,
  IndividualDriver,
  IUpdateDriver,
} from "@/app/types";
import { headers } from "next/headers";

export interface AddDriverPayload {
  firstName: string;
  lastName: string;
  phone: string;
  alternativePhone?: string;
  licenseNumber: string;
  licenseExpiry: string;
  status?: "active" | "inactive" | "suspended";
}

export interface AssignDriverPayload {
  vehicleId: string;
  driverId: string;
  role: "main" | "substitute";
}

export async function getDrivers(): Promise<IDriver> {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/drivers`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
        },
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch drivers");
    }

    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getDriversList(): Promise<DriversList> {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/drivers/driversList`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
        },
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch drivers list");
    }

    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getDriverDetails(id: string): Promise<IndividualDriver> {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/drivers/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
        },
        cache: "no-store",
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

export async function assignDriverToVehicle(payload: AssignDriverPayload) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/drivers/assignDriver`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to assign driver");
    }

    return {
      message: result.message,
      dto: result.dto,
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function unassignDriverFromVehicle(payload: {
  vehicleId: string;
  driverId: string;
  reason?: string;
}) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/drivers/unassignDriver`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
        },
        body: JSON.stringify(payload),
      }
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to unassign driver");
    }
    return {
      message: result.message,
      dto: result.dto,
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getDriverDashboard() {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/drivers/dashboard`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
        },
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch driver dashboard");
    }

    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getDriverMachineLearningData(id: string) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.ML_URL}/v1/drivers/5ba7fc05-a726-4331-8aad-7a8fca960002/summary`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
        },
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch driver machine learning data");
    }

    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function addDriver(driverData: AddDriverPayload) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/drivers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
        },
        body: JSON.stringify(driverData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create driver");
    }

    return {
      message: result.message,
      dto: result.dto,
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function updateDriver(id: string, driverData: IUpdateDriver) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/drivers/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
        },
        body: JSON.stringify(driverData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update driver");
    }

    return {
      message: result.message,
      dto: result.dto,
    };
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function getDriverVehicleHistory(id: string) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/drivers/${id}/vehicle-history`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
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
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/drivers/${id}/trips`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
        },
        cache: "no-store",
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
