CREATE TYPE "public"."assignment_status" AS ENUM('active', 'completed');--> statement-breakpoint
CREATE TYPE "public"."maintenance_priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."maintenance_status" AS ENUM('pending', 'scheduled', 'in_progress', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."maintenance_type" AS ENUM('preventive', 'repair', 'emergency', 'inspection', 'oil_change', 'brakes', 'tires', 'battery', 'cooling_system', 'filter_change', 'other');--> statement-breakpoint
CREATE TYPE "public"."trip_status" AS ENUM('scheduled', 'in_progress', 'completed', 'delayed', 'cancelled');--> statement-breakpoint
CREATE TABLE "maintenance_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"requested_by" uuid,
	"driver_id" uuid,
	"type" "maintenance_type" NOT NULL,
	"status" "maintenance_status" DEFAULT 'pending' NOT NULL,
	"priority" "maintenance_priority" DEFAULT 'medium' NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" varchar(500),
	"service_provider" varchar(100),
	"technician" varchar(100),
	"scheduled_date" timestamp with time zone,
	"completed_date" timestamp with time zone,
	"mileage" varchar(20),
	"estimated_cost" varchar(20),
	"actual_cost" varchar(20),
	"downtime_hours" varchar(10),
	"parts_used" varchar(1000),
	"notes" varchar(1000),
	"health_score_after" varchar(5),
	"warranty_covered" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "trips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"main_driver_id" uuid NOT NULL,
	"substitute_driver_id" uuid,
	"start_location" varchar(255) NOT NULL,
	"end_location" varchar(255) NOT NULL,
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone,
	"status" "trip_status" DEFAULT 'scheduled' NOT NULL,
	"distance_km" varchar(20),
	"fuel_used" varchar(20),
	"duration_minutes" varchar(10),
	"notes" varchar(1000),
	"actual_start_time" timestamp with time zone,
	"actual_end_time" timestamp with time zone,
	"actual_start_location" jsonb,
	"actual_end_location" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "vehicle_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"driver_id" uuid NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"role" "driver_role" NOT NULL,
	"status" "assignment_status" DEFAULT 'active' NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	"unassigned_at" timestamp with time zone,
	"notes" varchar(500)
);
--> statement-breakpoint
ALTER TABLE "drivers" ALTER COLUMN "role" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_main_driver_id_drivers_id_fk" FOREIGN KEY ("main_driver_id") REFERENCES "public"."drivers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_substitute_driver_id_drivers_id_fk" FOREIGN KEY ("substitute_driver_id") REFERENCES "public"."drivers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_assignments" ADD CONSTRAINT "vehicle_assignments_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_assignments" ADD CONSTRAINT "vehicle_assignments_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "maintenance_vehicle_idx" ON "maintenance_records" USING btree ("vehicle_id");--> statement-breakpoint
CREATE INDEX "maintenance_status_idx" ON "maintenance_records" USING btree ("status");--> statement-breakpoint
CREATE INDEX "trip_vehicle_idx" ON "trips" USING btree ("vehicle_id");--> statement-breakpoint
CREATE INDEX "trip_main_driver_idx" ON "trips" USING btree ("main_driver_id");--> statement-breakpoint
CREATE INDEX "trip_status_idx" ON "trips" USING btree ("status");--> statement-breakpoint
CREATE INDEX "trip_start_time_idx" ON "trips" USING btree ("start_time");