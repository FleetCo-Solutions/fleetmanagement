"use client";

import { useSession } from "next-auth/react";
import { ReactNode } from "react";

interface PermissionGuardProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export const PermissionGuard = ({
  permission,
  children,
  fallback = null,
}: PermissionGuardProps) => {
  const { data: session } = useSession();

  if (!session?.user) {
    return <>{fallback}</>;
  }

  const userPermissions = (session.user as any).permissions || [];

  if (userPermissions.includes(permission)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
