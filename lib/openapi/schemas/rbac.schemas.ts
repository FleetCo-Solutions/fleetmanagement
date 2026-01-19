import { z } from "zod";

export const PermissionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  scope: z.enum(["system", "company"]),
  createdAt: z.string().datetime(),
});

export const RolePermissionSchema = z.object({
  roleId: z.string().uuid(),
  permissionId: z.string().uuid(),
  permission: PermissionSchema.optional(),
});

export const RoleSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid().nullable(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().nullable(),
  permissions: z.array(RolePermissionSchema).optional(),
});

export const CreateRoleRequestSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  permissionIds: z.array(z.string().uuid()).optional(),
});

export const UpdateRoleRequestSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  permissionIds: z.array(z.string().uuid()).optional(),
});

export const RoleResponseSchema = z.object({
  message: z.string(),
  role: RoleSchema.optional(),
});

export const RolesListResponseSchema = z.array(RoleSchema);

export const PermissionsListResponseSchema = z.array(PermissionSchema);
