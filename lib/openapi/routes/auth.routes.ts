import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  LoginRequestSchema,
  LoginResponseSchema,
  ChangePasswordRequestSchema,
  ForgetPasswordRequestSchema,
  ForgetPasswordSystemUserRequestSchema,
  ResetPasswordRequestSchema,
  ResetPasswordConfirmRequestSchema,
  VerifyOtpRequestSchema,
  DriverLoginRequestSchema,
  DriverLoginResponseSchema,
  DriverVerifyRequestSchema,
  DriverVerifyResponseSchema,
  ValidateResetTokenRequestSchema,
  AdminLoginRequestSchema,
  AdminLoginResponseSchema,
} from "../schemas/auth.schemas";
import {
  SuccessResponseSchema,
  ErrorResponseSchema,
  UnauthorizedResponseSchema,
} from "../schemas/shared.schemas";
import { z } from "zod";

export function registerAuthRoutes(registry: OpenAPIRegistry) {
  // ... (Login routes remain unchanged) ...

  // User Login
  registry.registerPath({
    method: "post",
    path: "/api/auth/login",
    tags: ["Authentication"],
    summary: "User login",
    description: "Authenticate a user with email and password",
    request: {
      body: {
        content: {
          "application/json": {
            schema: LoginRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Login successful",
        content: {
          "application/json": {
            schema: LoginResponseSchema,
          },
        },
      },
      400: {
        description: "Bad request - missing credentials",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      401: {
        description: "Invalid credentials",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Driver Login
  registry.registerPath({
    method: "post",
    path: "/api/auth/driver/login",
    tags: ["Authentication"],
    summary: "Driver login",
    description:
      "Authenticate a driver with phone number and password. Returns JWT token and driver profile.",
    request: {
      body: {
        content: {
          "application/json": {
            schema: DriverLoginRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Login successful",
        content: {
          "application/json": {
            schema: DriverLoginResponseSchema,
          },
        },
      },
      400: {
        description: "Bad request - missing required fields",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      401: {
        description: "Invalid credentials",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      403: {
        description: "Driver account is not active",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Admin Login
  registry.registerPath({
    method: "post",
    path: "/api/adminusers/login",
    tags: ["Authentication"],
    summary: "Admin login",
    description:
      "Authenticate a system user (admin/staff) with email and password. Returns JWT token and user profile.",
    request: {
      body: {
        content: {
          "application/json": {
            schema: AdminLoginRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Login successful",
        content: {
          "application/json": {
            schema: AdminLoginResponseSchema,
          },
        },
      },
      400: {
        description: "Bad request - missing required fields",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      401: {
        description: "Invalid credentials",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      403: {
        description: "Account is not active",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Forget Password (Company Users & Drivers)
  registry.registerPath({
    method: "post",
    path: "/api/auth/forgetPassword",
    tags: ["Authentication"],
    summary: "Request password reset (Company Users & Drivers)",
    description:
      "Send password reset OTP via Email (Company Users) or return OTP (Drivers/Dev Mode)",
    request: {
      body: {
        content: {
          "application/json": {
            schema: ForgetPasswordRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "OTP generated/sent successfully",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              message: z.string(),
              otp: z.string().optional().openapi({
                description: "OTP returned in dev mode for drivers",
              }),
            }),
          },
        },
      },
    },
  });

  // Forget Password (System Users)
  registry.registerPath({
    method: "post",
    path: "/api/auth/forgetPasswordSystemUser",
    tags: ["Authentication"],
    summary: "Request password reset (System Users)",
    description: "Send password reset OTP via Email to system users",
    request: {
      body: {
        content: {
          "application/json": {
            schema: ForgetPasswordSystemUserRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "OTP sent successfully",
        content: {
          "application/json": {
            schema: SuccessResponseSchema,
          },
        },
      },
    },
  });

  // Verify OTP
  registry.registerPath({
    method: "post",
    path: "/api/auth/verifyOtp",
    tags: ["Authentication"],
    summary: "Verify OTP",
    description: "Verify one-time password for password reset (Email or Phone)",
    request: {
      body: {
        content: {
          "application/json": {
            schema: VerifyOtpRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "OTP verified successfully",
        content: {
          "application/json": {
            schema: SuccessResponseSchema,
          },
        },
      },
      400: {
        description: "Invalid OTP",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Reset Password Confirm (New)
  registry.registerPath({
    method: "post",
    path: "/api/auth/resetPassword/confirm",
    tags: ["Authentication"],
    summary: "Confirm password reset",
    description: "Finalize password reset using verified OTP and new password",
    request: {
      body: {
        content: {
          "application/json": {
            schema: ResetPasswordConfirmRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Password reset successfully",
        content: {
          "application/json": {
            schema: SuccessResponseSchema,
          },
        },
      },
      400: {
        description: "Bad request - invalid OTP session or password too short",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Reset Password (Legacy PATCH - keeping for backward compatibility if needed, or remove if unused)
  registry.registerPath({
    method: "patch",
    path: "/api/auth/resetPassword",
    tags: ["Authentication"],
    summary: "Reset password (Legacy)",
    description: "Reset password using verified OTP (Legacy endpoint)",
    request: {
      body: {
        content: {
          "application/json": {
            schema: ResetPasswordRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Password reset successfully",
        content: {
          "application/json": {
            schema: SuccessResponseSchema,
          },
        },
      },
      400: {
        description: "Bad request",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Validate Reset Token
  registry.registerPath({
    method: "post",
    path: "/api/auth/validate-reset-token",
    tags: ["Authentication"],
    summary: "Validate reset token",
    description:
      "Check if a password reset token is valid. Calls backend API to validate token.",
    request: {
      body: {
        content: {
          "application/json": {
            schema: ValidateResetTokenRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Token validation result",
        content: {
          "application/json": {
            schema: z.object({
              valid: z
                .boolean()
                .openapi({ description: "Whether the token is valid" }),
              user: z
                .any()
                .optional()
                .openapi({ description: "User data if token is valid" }),
              message: z
                .string()
                .optional()
                .openapi({ description: "Validation message" }),
            }),
          },
        },
      },
      400: {
        description: "Bad request - token is required",
        content: {
          "application/json": {
            schema: z.object({
              valid: z.boolean(),
              message: z.string(),
            }),
          },
        },
      },
      500: {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Driver Verify
  registry.registerPath({
    method: "post",
    path: "/api/auth/driver/verify",
    tags: ["Authentication"],
    summary: "Verify driver JWT token",
    description:
      "Verify a driver JWT token. Token can be provided in Authorization header as 'Bearer <token>' or in request body as { 'token': '...' }.",
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          "application/json": {
            schema: DriverVerifyRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Token verification result",
        content: {
          "application/json": {
            schema: DriverVerifyResponseSchema,
          },
        },
      },
      400: {
        description: "Bad request - token is required",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      500: {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Get Current Driver
  registry.registerPath({
    method: "get",
    path: "/api/auth/driver/me",
    tags: ["Authentication"],
    summary: "Get current driver",
    description:
      "Get authenticated driver information using JWT token from Authorization header",
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "Driver information retrieved successfully",
        content: {
          "application/json": {
            schema: DriverLoginResponseSchema,
          },
        },
      },
      401: {
        description: "Unauthorized - invalid or missing token",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      403: {
        description: "Forbidden - driver account is not active",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      404: {
        description: "Driver not found",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });
}
