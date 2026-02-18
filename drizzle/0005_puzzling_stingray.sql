CREATE TYPE "public"."actor_type" AS ENUM('user', 'system_user', 'driver');--> statement-breakpoint
CREATE TYPE "public"."notification_channel" AS ENUM('email', 'push', 'in_app');--> statement-breakpoint
CREATE TYPE "public"."permission_scope" AS ENUM('system', 'company');--> statement-breakpoint
CREATE TABLE "notification_group_types" (
	"group_id" uuid NOT NULL,
	"type" varchar(100) NOT NULL,
	"send_email" boolean DEFAULT false NOT NULL,
	CONSTRAINT "notification_group_types_group_id_type_pk" PRIMARY KEY("group_id","type")
);
--> statement-breakpoint
CREATE TABLE "notification_group_users" (
	"group_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "notification_group_users_group_id_user_id_pk" PRIMARY KEY("group_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "notification_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_preferences" (
	"user_id" uuid NOT NULL,
	"actor_type" "actor_type" NOT NULL,
	"channel" "notification_channel" NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	CONSTRAINT "notification_preferences_user_id_actor_type_channel_pk" PRIMARY KEY("user_id","actor_type","channel")
);
--> statement-breakpoint
CREATE TABLE "notification_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"type" varchar(50) NOT NULL,
	"criteria" jsonb NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"actor_type" "actor_type" NOT NULL,
	"type" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" varchar(1000) NOT NULL,
	"link" varchar(255),
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_user_roles" (
	"system_user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	CONSTRAINT "system_user_roles_system_user_id_role_id_pk" PRIMARY KEY("system_user_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "vehicle_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" varchar(1000),
	"document_type" varchar(100) NOT NULL,
	"cloudinary_public_id" varchar(255) NOT NULL,
	"cloudinary_secure_url" varchar(1000) NOT NULL,
	"expiry_date" timestamp with time zone,
	"reminder_config" jsonb DEFAULT '{"intervals":[30,15,7],"postExpiryDays":7}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "vehicle_locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid,
	"vehicle_id" uuid NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"heading" real,
	"speed" real,
	"status" varchar(20) DEFAULT 'moving',
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vehicle_locations_vehicle_id_unique" UNIQUE("vehicle_id")
);
--> statement-breakpoint
DROP INDEX "system_user_role_idx";--> statement-breakpoint
DROP INDEX "audit_log_user_idx";--> statement-breakpoint
ALTER TABLE "password_reset_otps" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "roles" ALTER COLUMN "company_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "admin_audit_logs" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "admin_audit_logs" ADD COLUMN "driver_id" uuid;--> statement-breakpoint
ALTER TABLE "admin_audit_logs" ADD COLUMN "company_id" uuid;--> statement-breakpoint
ALTER TABLE "admin_audit_logs" ADD COLUMN "old_values" varchar(2000);--> statement-breakpoint
ALTER TABLE "admin_audit_logs" ADD COLUMN "new_values" varchar(2000);--> statement-breakpoint
ALTER TABLE "password_reset_otps" ADD COLUMN "driver_id" uuid;--> statement-breakpoint
ALTER TABLE "password_reset_otps" ADD COLUMN "phone" varchar(20);--> statement-breakpoint
ALTER TABLE "permissions" ADD COLUMN "scope" "permission_scope" DEFAULT 'company' NOT NULL;--> statement-breakpoint
ALTER TABLE "notification_group_types" ADD CONSTRAINT "notification_group_types_group_id_notification_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."notification_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_group_users" ADD CONSTRAINT "notification_group_users_group_id_notification_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."notification_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_group_users" ADD CONSTRAINT "notification_group_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_groups" ADD CONSTRAINT "notification_groups_company_id_admin_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."admin_companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_rules" ADD CONSTRAINT "notification_rules_company_id_admin_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."admin_companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "system_user_roles" ADD CONSTRAINT "system_user_roles_system_user_id_admin_system_users_id_fk" FOREIGN KEY ("system_user_id") REFERENCES "public"."admin_system_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "system_user_roles" ADD CONSTRAINT "system_user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_documents" ADD CONSTRAINT "vehicle_documents_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_locations" ADD CONSTRAINT "vehicle_locations_company_id_admin_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."admin_companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_locations" ADD CONSTRAINT "vehicle_locations_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "notification_group_type_idx" ON "notification_group_types" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "notification_group_type_string_idx" ON "notification_group_types" USING btree ("type");--> statement-breakpoint
CREATE INDEX "notification_group_user_idx" ON "notification_group_users" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "notification_group_user_userid_idx" ON "notification_group_users" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notification_group_company_idx" ON "notification_groups" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "notification_rules_company_idx" ON "notification_rules" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "notification_user_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notification_actor_type_idx" ON "notifications" USING btree ("actor_type");--> statement-breakpoint
CREATE INDEX "notification_is_read_idx" ON "notifications" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "notification_created_at_idx" ON "notifications" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "vehicle_document_vehicle_idx" ON "vehicle_documents" USING btree ("vehicle_id");--> statement-breakpoint
CREATE INDEX "vehicle_document_expiry_idx" ON "vehicle_documents" USING btree ("expiry_date");--> statement-breakpoint
CREATE INDEX "vehicle_location_vehicle_idx" ON "vehicle_locations" USING btree ("vehicle_id");--> statement-breakpoint
CREATE INDEX "vehicle_location_company_idx" ON "vehicle_locations" USING btree ("company_id");--> statement-breakpoint
ALTER TABLE "admin_audit_logs" ADD CONSTRAINT "admin_audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_audit_logs" ADD CONSTRAINT "admin_audit_logs_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_audit_logs" ADD CONSTRAINT "admin_audit_logs_company_id_admin_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."admin_companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_otps" ADD CONSTRAINT "password_reset_otps_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_log_system_user_idx" ON "admin_audit_logs" USING btree ("system_user_id");--> statement-breakpoint
CREATE INDEX "audit_log_driver_idx" ON "admin_audit_logs" USING btree ("driver_id");--> statement-breakpoint
CREATE INDEX "audit_log_company_idx" ON "admin_audit_logs" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "audit_log_created_at_idx" ON "admin_audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "otp_phone_idx" ON "password_reset_otps" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "audit_log_user_idx" ON "admin_audit_logs" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "admin_audit_logs" DROP COLUMN "details";--> statement-breakpoint
ALTER TABLE "admin_system_users" DROP COLUMN "role";--> statement-breakpoint
ALTER TABLE "admin_system_users" DROP COLUMN "department";--> statement-breakpoint
ALTER TABLE "admin_system_users" DROP COLUMN "permissions";