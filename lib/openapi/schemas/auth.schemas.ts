import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import {
  SingleItemResponseSchema,
  SuccessResponseSchema,
  ErrorResponseSchema,
  UnauthorizedResponseSchema,
} from "./shared.schemas";

extendZodWithOpenApi(z);

/**
 * Login request schema
 */
export const LoginRequestSchema = z.object({
  username: z
    .string()
    .email()
    .openapi({
      description: "User email address",
      example: "user@example.com",
    }),
  password: z
    .string()
    .min(1)
    .openapi({ description: "User password", example: "password123" }),
});

/**
 * Login response schema
 */
export const LoginResponseSchema = SingleItemResponseSchema(
  z.object({
    message: z.string().openapi({ example: "Login successful" }),
    user: z.object({
      id: z.string().uuid(),
      companyId: z.string().uuid().nullable(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      status: z.enum(["active", "inactive", "suspended"]),
    }),
  })
);

/**
 * Driver login response schema
 */
export const DriverLoginResponseSchema = z.object({
  success: z.boolean().openapi({ description: "Success flag" }),
  token: z
    .string()
    .optional()
    .openapi({
      description:
        "JWT token for authenticated driver (only in login response)",
    }),
  driver: z
    .object({
      id: z.string().uuid(),
      firstName: z.string(),
      lastName: z.string(),
      phoneNumber: z.string(),
      vehicleId: z.string().uuid().nullable(),
      vehicleName: z.string().nullable(),
      role: z.enum(["main", "substitute"]),
      assignedTrips: z.array(
        z.object({
          id: z.string().uuid(),
          vehicleId: z.string().uuid().nullable(),
          startLocation: z.string().nullable(),
          endLocation: z.string().nullable(),
          startTime: z.string().datetime(),
          status: z.string(),
        })
      ),
    })
    .optional(),
  message: z
    .string()
    .optional()
    .openapi({ description: "Error message if operation failed" }),
});

/**
 * Admin login response schema
 */
export const AdminLoginResponseSchema = z.object({
  success: z.boolean().openapi({ description: "Success flag" }),
  token: z
    .string()
    .optional()
    .openapi({ description: "JWT token for authenticated admin" }),
  user: z
    .object({
      id: z.string().uuid(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      role: z.string(),
      department: z.string().nullable(),
    })
    .optional(),
  message: z
    .string()
    .optional()
    .openapi({ description: "Error message if operation failed" }),
});

/**
 * Driver verify response schema
 */
export const DriverVerifyResponseSchema = z.object({
  success: z.boolean().openapi({ description: "Success flag" }),
  valid: z.boolean().openapi({ description: "Whether the token is valid" }),
  payload: z
    .object({
      id: z.string().uuid().openapi({ description: "User or Driver ID" }),
      vehicleId: z.string().uuid().nullable(),
      role: z.string().nullable(),
      phoneNumber: z.string().nullable(),
      type: z
        .enum(["driver", "systemUser"])
        .openapi({ description: "Token type" }),
    })
    .optional(),
  message: z
    .string()
    .optional()
    .openapi({ description: "Error message if verification failed" }),
});

/**
 * Change password request schema
 */
export const ChangePasswordRequestSchema = z.object({
  userId: z.string().uuid().openapi({ description: "User ID" }),
  oldPassword: z.string().min(1).openapi({ description: "Current password" }),
  password: z
    .string()
    .min(8)
    .openapi({ description: "New password (min 8 characters)" }),
});

/**
 * Forget password request schema
 */
/**
 * Forget password request schema
 */
export const ForgetPasswordRequestSchema = z.object({
  email: z
    .string()
    .email()
    .optional()
    .openapi({
      description: "User email address (required if phone is not provided)",
    }),
  phone: z
    .string()
    .optional()
    .openapi({
      description: "Driver phone number (required if email is not provided)",
    }),
});

/**
 * Forget password system user request schema
 */
export const ForgetPasswordSystemUserRequestSchema = z.object({
  email: z
    .string()
    .email()
    .openapi({ description: "System user email address" }),
});

/**
 * Reset password request schema (Legacy PATCH)
 */
export const ResetPasswordRequestSchema = z.object({
  email: z.string().email().openapi({ description: "User email address" }),
  newPassword: z
    .string()
    .min(8)
    .openapi({ description: "New password (min 8 characters)" }),
});

/**
 * Reset password confirm request schema (New POST)
 */
export const ResetPasswordConfirmRequestSchema = z.object({
  identifier: z.string().openapi({ description: "Email or Phone Number" }),
  otp: z.string().length(6).openapi({ description: "6-digit OTP code" }),
  newPassword: z
    .string()
    .min(8)
    .openapi({ description: "New password (min 8 characters)" }),
});

/**
 * Verify OTP request schema
 */
export const VerifyOtpRequestSchema = z.object({
  email: z
    .string()
    .email()
    .optional()
    .openapi({ description: "User email address" }),
  phone: z.string().optional().openapi({ description: "Driver phone number" }),
  otp: z.string().length(6).openapi({ description: "6-digit OTP code" }),
});

/**
 * Driver login request schema
 */
export const DriverLoginRequestSchema = z.object({
  phoneNumber: z
    .string()
    .min(1)
    .openapi({ description: "Driver phone number", example: "255783845395" }),
  password: z
    .string()
    .min(1)
    .openapi({ description: "Driver password", example: "Welcome@123" }),
});

/**
 * Admin login request schema
 */
export const AdminLoginRequestSchema = z.object({
  email: z
    .string()
    .email()
    .openapi({
      description: "Admin email address",
      example: "admin@fleetco.com",
    }),
  password: z
    .string()
    .min(1)
    .openapi({ description: "Admin password", example: "password123" }),
});

/**
 * Driver verify request schema (verifies JWT token)
 */
export const DriverVerifyRequestSchema = z
  .object({
    token: z.string().optional().openapi({
      description:
        "JWT token to verify. Can also be provided in Authorization header as 'Bearer <token>'",
      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    }),
  })
  .openapi({
    description:
      "Token can be provided in request body or Authorization header",
  });

/**
 * Validate reset token request schema
 */
export const ValidateResetTokenRequestSchema = z.object({
  token: z.string().openapi({ description: "Reset token to validate" }),
});
