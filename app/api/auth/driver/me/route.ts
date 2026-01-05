import { NextRequest, NextResponse } from 'next/server';
import { getCurrentDriver } from './getCurrentDriver';

/**
 * Get current authenticated driver profile
 * GET /api/auth/driver/me
 *
 * Request headers:
 *   Authorization: Bearer <token>
 *
 * Response:
 * {
 *   "success": true,
 *   "driver": {
 *     "id": "uuid",
 *     "firstName": "string",
 *     "lastName": "string",
 *     "phoneNumber": "string",
 *     "vehicleId": "uuid | null",
 *     "role": "main | substitute",
 *     "assignedTrips": [...]
 *   }
 * }
 */
export async function GET(request: NextRequest) {
  return getCurrentDriver(request);
}

