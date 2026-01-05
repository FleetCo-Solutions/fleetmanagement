import { NextRequest } from 'next/server';
import { verifyDriverTokenEndpoint } from './post';

/**
 * Driver token verification endpoint
 * POST /api/auth/driver/verify
 *
 * Request headers:
 *   Authorization: Bearer <token>
 *
 * OR
 *
 * Request body:
 *   { "token": "jwt_token_here" }
 *
 * Response:
 *   {
 *     "success": true,
 *     "valid": true,
 *     "payload": { ... }
 *   }
 */
export async function POST(request: NextRequest) {
  return verifyDriverTokenEndpoint(request);
}

