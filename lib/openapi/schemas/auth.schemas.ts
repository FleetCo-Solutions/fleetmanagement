import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { SingleItemResponseSchema, SuccessResponseSchema, ErrorResponseSchema, UnauthorizedResponseSchema } from "./shared.schemas";

extendZodWithOpenApi(z);

/**
 * Login request schema
 */
export const LoginRequestSchema = z.object({
  username: z.string().email().openapi({ description: "User email address", example: "user@example.com" }),
  password: z.string().min(1).openapi({ description: "User password", example: "password123" }),
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
 * Change password request schema
 */
export const ChangePasswordRequestSchema = z.object({
  currentPassword: z.string().min(1).openapi({ description: "Current password" }),
  newPassword: z.string().min(8).openapi({ description: "New password (min 8 characters)" }),
});

/**
 * Forget password request schema
 */
export const ForgetPasswordRequestSchema = z.object({
  email: z.string().email().openapi({ description: "User email address" }),
});

/**
 * Reset password request schema
 */
export const ResetPasswordRequestSchema = z.object({
  token: z.string().openapi({ description: "Reset token" }),
  password: z.string().min(8).openapi({ description: "New password (min 8 characters)" }),
});

/**
 * Verify OTP request schema
 */
export const VerifyOtpRequestSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6).openapi({ description: "6-digit OTP code" }),
});

/**
 * Driver login request schema
 */
export const DriverLoginRequestSchema = z.object({
  phone: z.string().min(1).openapi({ description: "Driver phone number" }),
  password: z.string().min(1).openapi({ description: "Driver password" }),
});

/**
 * Driver verify request schema
 */
export const DriverVerifyRequestSchema = z.object({
  phone: z.string().min(1),
  otp: z.string().length(6),
});

/**
 * Validate reset token request schema
 */
export const ValidateResetTokenRequestSchema = z.object({
  token: z.string().openapi({ description: "Reset token to validate" }),
});
