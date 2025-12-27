/**
 * Vehicles API Routes
 * Functions to interact with frontend database for vehicle metadata
 */

import type { InferSelectModel } from 'drizzle-orm';
import { vehicles } from '@/app/db/schema';

type DbVehicle = InferSelectModel<typeof vehicles>;

/**
 * Vehicle metadata from frontend database
 */
export interface VehicleMetadata {
  id: string;
  registrationNumber: string;
  model: string;
  manufacturer: string;
  vin: string;
  color: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
  drivers?: Array<{
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  }>;
}

/**
 * Fetch all vehicles with their metadata from frontend database
 *
 * @returns Promise resolving to array of vehicle metadata
 * @throws {Error} if API request fails
 */
export async function fetchVehicleMetadata(): Promise<VehicleMetadata[]> {
  try {
    const response = await fetch('/api/vehicles', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch vehicles: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.dto || !Array.isArray(result.dto.content)) {
      throw new Error('Invalid response format from vehicles API');
    }

    return result.dto.content.map((vehicle: DbVehicle & { drivers?: Array<{ id: string; firstName: string; lastName: string; phone: string }> }) => ({
      id: vehicle.id,
      registrationNumber: vehicle.registrationNumber,
      model: vehicle.model,
      manufacturer: vehicle.manufacturer,
      vin: vehicle.vin,
      color: vehicle.color,
      createdAt: new Date(vehicle.createdAt),
      updatedAt: vehicle.updatedAt ? new Date(vehicle.updatedAt) : null,
      deletedAt: vehicle.deletedAt ? new Date(vehicle.deletedAt) : null,
      drivers: vehicle.drivers?.map((driver) => ({
        id: driver.id,
        firstName: driver.firstName,
        lastName: driver.lastName,
        phone: driver.phone,
      })),
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch vehicle metadata from frontend database');
  }
}

