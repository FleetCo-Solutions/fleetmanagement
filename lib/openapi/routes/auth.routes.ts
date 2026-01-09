import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import {
  LoginRequestSchema,
  LoginResponseSchema,
  ChangePasswordRequestSchema,
  ForgetPasswordRequestSchema,
  ResetPasswordRequestSchema,
  VerifyOtpRequestSchema,
  DriverLoginRequestSchema,
  DriverVerifyRequestSchema,
  ValidateResetTokenRequestSchema,
} from "../schemas/auth.schemas";
import { SuccessResponseSchema, ErrorResponseSchema, UnauthorizedResponseSchema } from "../schemas/shared.schemas";

export function registerAuthRoutes(registry: OpenAPIRegistry) {
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
    description: "Authenticate a driver with phone and password",
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
            schema: SuccessResponseSchema,
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

  // Change Password
  registry.registerPath({
    method: "post",
    path: "/api/auth/changePassword",
    tags: ["Authentication"],
    summary: "Change user password",
    description: "Change the password for the authenticated user",
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          "application/json": {
            schema: ChangePasswordRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Password changed successfully",
        content: {
          "application/json": {
            schema: SuccessResponseSchema,
          },
        },
      },
      401: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: UnauthorizedResponseSchema,
          },
        },
      },
    },
  });

  // Forget Password
  registry.registerPath({
    method: "post",
    path: "/api/auth/forgetPassword",
    tags: ["Authentication"],
    summary: "Request password reset",
    description: "Send password reset email to user",
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
        description: "Reset email sent successfully",
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
    description: "Verify one-time password for password reset",
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

  // Reset Password
  registry.registerPath({
    method: "patch",
    path: "/api/auth/resetPassword",
    tags: ["Authentication"],
    summary: "Reset password",
    description: "Reset password using reset token",
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
        description: "Invalid token",
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
    method: "get",
    path: "/api/auth/validate-reset-token",
    tags: ["Authentication"],
    summary: "Validate reset token",
    description: "Check if a password reset token is valid",
    request: {
      query: ValidateResetTokenRequestSchema,
    },
    responses: {
      200: {
        description: "Token is valid",
        content: {
          "application/json": {
            schema: SuccessResponseSchema,
          },
        },
      },
      400: {
        description: "Invalid or expired token",
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
    summary: "Verify driver OTP",
    description: "Verify OTP for driver authentication",
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
        description: "Driver verified successfully",
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

  // Get Current Driver
  registry.registerPath({
    method: "get",
    path: "/api/auth/driver/me",
    tags: ["Authentication"],
    summary: "Get current driver",
    description: "Get authenticated driver information",
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "Driver information",
        content: {
          "application/json": {
            schema: SuccessResponseSchema,
          },
        },
      },
      401: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: UnauthorizedResponseSchema,
          },
        },
      },
    },
  });
}
