import { auth } from "@/app/auth";
import { headers } from "next/headers";
import { verifyDriverToken, extractTokenFromHeader } from "./jwt";

export interface AuthenticatedUser {
  id: string;
  companyId: string;
  role?: string;
  type: "user" | "driver";
}

/**
 * Get the authenticated user from either session (Web) or JWT (Mobile)
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  // 1. Check for Web Session (Cookies)
  const session = await auth();
  if (session?.user?.companyId) {
    return {
      id: session.user.id || "",
      companyId: session.user.companyId,
      type: "user",
    };
  }

  // 2. Check for Mobile Token (Bearer JWT)
  const headersList = await headers();
  const authHeader = headersList.get("Authorization");
  const token = extractTokenFromHeader(authHeader);

  if (token) {
    try {
      const payload = verifyDriverToken(token);
      // Ensure companyId exists in payload (it should after our update)
      if (payload.companyId) {
        return {
          id: payload.driverId,
          companyId: payload.companyId,
          role: payload.role,
          type: "driver",
        };
      }
    } catch (error) {
      // Token verification failed
      console.error(
        "Token verification failed in getAuthenticatedUser:",
        error
      );
    }
  }

  return null;
}
