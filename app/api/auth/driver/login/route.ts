import { NextRequest } from 'next/server';
import { loginDriver } from './post';

/**
 * Driver login endpoint
 * POST /api/auth/driver/login
 *
 * Request body:
 * {
 *   "phoneNumber": "string",
 *   "password": "string"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "token": "jwt_token_here",
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
export async function POST(request: NextRequest) {
  return loginDriver(request);
}

