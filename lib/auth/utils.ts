import { auth } from "@/app/auth";
import { verifyToken, extractTokenFromHeader } from "./jwt";
import { NextRequest } from "next/server";
import { AuthenticatedUser, AuthenticatedError } from "./types";

export type { AuthenticatedUser, AuthenticatedError };

/**
 * Get the authenticated user from either session (Web) or JWT (Mobile/Admin)
 */
export async function getAuthenticatedUser(
  request: NextRequest
): Promise<AuthenticatedUser | AuthenticatedError | null> {
  // 1. Check for Web Session (Cookies)
  const session = await auth();
  if (session?.user?.companyId) {
    return {
      id: session.user.id,
      companyId: session.user.companyId,
      type: "user",
    };
  }

  // 2. Check for Mobile/Admin Token (Bearer JWT)
  const authHeader = request.headers.get("Authorization");

  const token = extractTokenFromHeader(authHeader);

  if (token) {
    try {
      const payload = verifyToken(token);

      if (payload.type === "driver" && payload.companyId) {
        return {
          id: payload.id,
          companyId: payload.companyId,
          role: payload.role,
          type: "driver",
        };
      }

      if (payload.type === "systemUser") {
        return {
          id: payload.id,
          companyId: payload.companyId || "",
          role: payload.role,
          type: "systemUser",
        };
      }
    } catch (error) {
      // Token verification failed
      return {
        timestamp: new Date(),
        message: "Token verification failed:" + (error as Error).message,
      };
    }
  }

  return null;
}
