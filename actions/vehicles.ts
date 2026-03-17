"use server";

import { IPostVehicle } from "@/app/api/vehicles/post";
import type {
  VehicleDetailsResponse,
  Vehicle,
  IVehicles,
  VehiclesList,
} from "@/app/types";
import { headers } from "next/headers";

export interface UpdateVehiclePayload {
  registrationNumber: string;
  model: string;
  manufacturer: string;
  vin: string;
  color: string;
  status?: string;
  imei?: string;
  simCardNumber?: string;
  expiryType?: string;
  expiryDate?: string;
  description?: string | null;
  year?: string | null;
  odometer?: string | null;
  flespiIdent?: string | null;
  simSerialNumber?: string | null;
  assetId?: string | null;
  deviceBrand?: string | null;
  deviceModel?: string | null;
  ioConfigs?: string | null;
  assetStatus?: string | null;
  assetStatusNotes?: string | null;
  assetStatusExpiry?: string | null;
}

import { auth } from "@/app/auth";
import { fetchVehiclesFromDb, fetchVehiclesListFromDb } from "@/lib/services/vehicle-service";


const MOCK_VEHICLES = [
  {
    id: "0661ffc2-be90-4506-9de3-98549dd20a42",
    companyId: "comp-1",
    registrationNumber: "T 123 ABC",
    model: "Hilux",
    manufacturer: "Toyota",
    vin: "VIN-TOY-HILUX-001",
    color: "White",
    description: "Standard delivery vehicle for regional routes.",
    year: "2022",
    odometer: "45230",
    simSerialNumber: "892550123456789",
    assetId: "AST-2022-001",
    flespiIdent: "123456789012345",
    deviceBrand: "Teltonika",
    deviceModel: "FMC130",
    ioConfigs: '[{"name": "Fuel Sensor", "type": "Analog Input", "status": "active"}, {"name": "Door Sensor", "type": "Digital Input", "status": "active"}]',
    healthRate: 85,
    costPerMonth: 1250000,
    fuelEfficiency: 12.5,
    status: "available",
    deletedAt: null,
    drivers: [
      {
        id: "d1",
        firstName: "Juma",
        lastName: "Kassim",
        phone: "0712345678",
        alternativePhone: null,
        passwordHash: "",
        status: "active",
        role: "main",
        vehicleId: "0661ffc2-be90-4506-9de3-98549dd20a42",
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
        companyId: "comp-1",
      },
    ],
    assetStatus: "available",
    statusHistory: [
      {
        id: "sh-1",
        status: "under maintenance",
        notes: "Routine 10,000 km oil change and inspection.",
        expiryDate: null,
        changedBy: "Admin User",
        changedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "sh-2",
        status: "available",
        notes: "Maintenance completed, vehicle is ready for dispatch.",
        expiryDate: null,
        changedBy: "System",
        changedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ]
  },
  {
    id: "v2-mock-id",
    companyId: "comp-1",
    registrationNumber: "T 789 XYZ",
    model: "Fuso Fighter",
    manufacturer: "Mitsubishi",
    vin: "VIN-MIT-FUSO-002",
    color: "Blue",
    description: "Heavy duty transport truck.",
    year: "2021",
    odometer: "89450",
    simSerialNumber: "892550987654321",
    assetId: "AST-2021-002",
    flespiIdent: "987654321098765",
    deviceBrand: "Ruptela",
    deviceModel: "HCV5",
    ioConfigs: '[{"name": "Temperature Probe", "type": "1-Wire", "status": "active"}]',
    healthRate: 72,
    costPerMonth: 2800000,
    fuelEfficiency: 6.8,
    status: "en route",
    deletedAt: null,
    drivers: [
      {
        id: "d2",
        firstName: "Sarah",
        lastName: "Mdoe",
        phone: "0788123456",
        alternativePhone: null,
        passwordHash: "",
        status: "active",
        role: "main",
        vehicleId: "v2-mock-id",
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
        companyId: "comp-1",
      },
    ],
    assetStatus: "operational - not downloading",
    assetStatusNotes: "Telemetry unit is reporting errors, scheduled for inspection next week.",
    statusHistory: [
      {
        id: "sh-3",
        status: "available",
        notes: "Initial deployment.",
        expiryDate: null,
        changedBy: "System",
        changedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "sh-4",
        status: "operational - not downloading",
        notes: "Telemetry stopped responding yesterday at 14:00.",
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        changedBy: "Support Agent",
        changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ]
  },
];

export async function getVehicles(): Promise<IVehicles> {
  const date = new Date();
  try {
    // For development/mock purposes, return hardcoded data
    return {
      timestamp: date,
      statusCode: "200",
      message: "Vehicles fetched successful (Mock Data)",
      dto: {
        content: MOCK_VEHICLES as any[],
        totalPages: 1,
        totalElements: MOCK_VEHICLES.length,
        currentPage: 0,
        pageSize: MOCK_VEHICLES.length,
        hasNext: false,
        hasPrevious: false,
      },
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getVehiclesList(): Promise<VehiclesList> {
  try {
    return {
      timestamp: new Date(),
      statusCode: "200",
      message: "Vehicles list retrieved successfully (Mock Data)",
      dto: MOCK_VEHICLES.map((v) => ({
        id: v.id,
        registrationNumber: v.registrationNumber,
        model: v.model,
        manufacturer: v.manufacturer,
        assignedDriver: v.drivers[0] ? {
          id: v.drivers[0].id,
          firstName: v.drivers[0].firstName,
          lastName: v.drivers[0].lastName,
          role: v.drivers[0].role as any,
        } : null,
      })),
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getVehicleDetails(
  id: string
): Promise<VehicleDetailsResponse> {
  try {
    const vehicle = MOCK_VEHICLES.find((v) => v.id === id) || MOCK_VEHICLES[0];

    return {
      timestamp: new Date(),
      statusCode: "200",
      message: "Vehicle fetched successfully (Mock Data)",
      dto: vehicle as any,
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function addVehicle(vehicleData: IPostVehicle) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/vehicles`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
        },
        body: JSON.stringify(vehicleData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create vehicle");
    }

    return {
      message: result.message,
      dto: result.dto,
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function updateVehicle(id: string, payload: UpdateVehiclePayload) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/vehicles/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update vehicle");
    }

    return {
      message: result.message,
      dto: result.dto,
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getVehicleDriverHistory(id: string) {
  try {
    return {
      timestamp: new Date(),
      statusCode: "200",
      message: "Driver history fetched successfully (Mock Data)",
      dto: [
        {
          driver: {
            id: "d1",
            firstName: "Juma",
            lastName: "Kassim",
          },
          role: "main",
          status: "active",
          assignedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          unassignedAt: null,
        },
        {
          driver: {
            id: "d4",
            firstName: "Baraka",
            lastName: "Said",
          },
          role: "main",
          status: "inactive",
          assignedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          unassignedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getVehicleTrips(id: string) {
  try {
    return {
      timestamp: new Date(),
      statusCode: "200",
      message: "Vehicle trips fetched successfully (Mock Data)",
      dto: {
        content: [
          {
            tripId: "t1",
            startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            mainDriver: {
              firstName: "Juma",
              lastName: "Kassim",
            },
            startLocation: "Tegeta, Dar es Salaam",
            endLocation: "Posta, Dar es Salaam",
            distanceKm: "12.5",
            status: "completed",
          },
          {
            tripId: "t2",
            startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            mainDriver: {
              firstName: "Juma",
              lastName: "Kassim",
            },
            startLocation: "Posta, Dar es Salaam",
            endLocation: "Mwenge, Dar es Salaam",
            distanceKm: "8.2",
            status: "completed",
          },
        ],
        totalPages: 1,
        totalElements: 2,
        currentPage: 0,
        pageSize: 10,
        hasNext: false,
        hasPrevious: false,
      },
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getAuditLogs(entityType: string, entityId: string) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/auditLogs?entityType=${entityType}&entityId=${entityId}`,
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
      throw new Error(result.message || "Failed to fetch audit logs");
    }
    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
