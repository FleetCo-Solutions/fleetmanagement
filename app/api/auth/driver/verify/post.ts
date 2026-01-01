import { NextRequest, NextResponse } from 'next/server';
import { verifyDriverToken, extractTokenFromHeader } from '@/lib/auth/jwt';

interface TokenVerifyResponse {
  success: boolean;
  valid: boolean;
  payload?: {
    driverId: string;
    vehicleId: string | null;
    role: 'main' | 'substitute';
    phoneNumber: string;
  };
  message?: string;
}

/**
 * Verify driver JWT token
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
 *     "payload": {
 *       "driverId": "uuid",
 *       "vehicleId": "uuid | null",
 *       "role": "main | substitute",
 *       "phoneNumber": "string"
 *     }
 *   }
 */
export async function verifyDriverTokenEndpoint(
  request: NextRequest
): Promise<NextResponse<TokenVerifyResponse>> {
  try {
    // Try to get token from Authorization header first
    const authHeader = request.headers.get('Authorization');
    let token = extractTokenFromHeader(authHeader);

    // If not in header, try request body
    if (!token) {
      try {
        const body = (await request.json()) as { token?: string };
        token = body.token || null;
      } catch {
        // Body might be empty, that's okay
      }
    }

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          message: 'Token is required. Provide it in Authorization header (Bearer <token>) or request body ({ "token": "..." })',
        },
        { status: 400 }
      );
    }

    // Verify token
    try {
      const payload = verifyDriverToken(token);

      return NextResponse.json(
        {
          success: true,
          valid: true,
          payload: {
            driverId: payload.driverId,
            vehicleId: payload.vehicleId,
            role: payload.role,
            phoneNumber: payload.phoneNumber,
          },
        },
        { status: 200 }
      );
    } catch (error) {
      // Token verification failed (invalid, expired, etc.)
      const errorMessage = error instanceof Error ? error.message : 'Token verification failed';

      return NextResponse.json(
        {
          success: true,
          valid: false,
          message: errorMessage,
        },
        { status: 200 } // 200 because verification was successful, just token is invalid
      );
    }
  } catch (error) {
    console.error('Token verification endpoint error:', error);
    return NextResponse.json(
      {
        success: false,
        valid: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

