import jwt from "jsonwebtoken";

/**
 * JWT token payload structure for authentication
 */
export interface AuthTokenPayload {
  id: string;
  type: "systemUser" | "driver";
  companyId?: string;
  vehicleId?: string | null;
  role?: string;
  phoneNumber?: string;
}

/**
 * JWT configuration
 */
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const JWT_ISSUER = "fleet-management";

/**
 * Generate JWT token
 *
 * @param payload - Token payload
 * @returns JWT token string
 */
export function generateToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: JWT_ISSUER,
    audience: "fleet-management",
  } as jwt.SignOptions);
}

/**
 * Verify and decode JWT token
 *
 * @param token - JWT token string
 * @returns Decoded token payload
 * @throws Error if token is invalid or expired
 */
export function verifyToken(token: string): AuthTokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: "fleet-management",
    }) as AuthTokenPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error(`Invalid token: ${error.message}`);
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token has expired");
    }
    throw new Error("Token verification failed");
  }
}

/**
 * Extract token from Authorization header
 *
 * @param authHeader - Authorization header value (e.g., "Bearer <token>")
 * @returns Token string or null if not found
 */
export function extractTokenFromHeader(
  authHeader: string | null
): string | null {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  return parts[1];
}
