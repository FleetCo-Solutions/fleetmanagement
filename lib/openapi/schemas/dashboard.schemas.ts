import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import {
  ErrorResponseSchema,
  UnauthorizedResponseSchema,
} from "./shared.schemas";

extendZodWithOpenApi(z);

export const DashboardSummaryResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    vehicles: z.object({
      total: z.number(),
      available: z.number(),
      inTrip: z.number(),
      underMaintenance: z.number(),
      outOfService: z.number(),
    }),
    recentTrips: z.array(
      z.object({
        id: z.string().uuid(),
        driverName: z.string(),
        tripStartTime: z.string().datetime().nullable(),
        phoneNo: z.string().nullable(),
        destination: z.string(),
        vehicleReg: z.string().optional(),
        violationRate: z.number(),
        fuelUsage: z.number(),
      }),
    ),
    performance: z.array(
      z.object({
        name: z.string(),
        value: z.number(),
      }),
    ),
    violations: z.array(
      z.object({
        name: z.string(),
        value: z.number(),
      }),
    ),
  }),
});
