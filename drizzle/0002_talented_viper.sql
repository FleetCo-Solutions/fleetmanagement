CREATE TYPE "public"."admin_company_status" AS ENUM('active', 'suspended', 'trial', 'expired');--> statement-breakpoint
CREATE TYPE "public"."admin_system_user_role" AS ENUM('super_admin', 'admin', 'support', 'sales', 'billing');--> statement-breakpoint
CREATE TYPE "public"."admin_system_user_status" AS ENUM('active', 'inactive', 'suspended');--> statement-breakpoint
CREATE TABLE "admin_audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"system_user_id" uuid,
	"action" varchar(255) NOT NULL,
	"entity_type" varchar(100) NOT NULL,
	"entity_id" uuid,
	"details" varchar(1000),
	"ip_address" varchar(45),
	"user_agent" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"status" "admin_company_status" DEFAULT 'trial' NOT NULL,
	"contact_person" varchar(255) NOT NULL,
	"contact_email" varchar(255) NOT NULL,
	"contact_phone" varchar(50) NOT NULL,
	"country" varchar(100) NOT NULL,
	"address" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "permissions_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	CONSTRAINT "role_permissions_role_id_permission_id_pk" PRIMARY KEY("role_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "admin_system_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" "admin_system_user_role" DEFAULT 'support' NOT NULL,
	"department" varchar(100),
	"status" "admin_system_user_status" DEFAULT 'active' NOT NULL,
	"phone" varchar(50),
	"avatar" varchar(255),
	"permissions" varchar(1000),
	"last_login" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "admin_system_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	CONSTRAINT "user_roles_user_id_role_id_pk" PRIMARY KEY("user_id","role_id")
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password_hash" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "company_id" uuid;--> statement-breakpoint
ALTER TABLE "maintenance_records" ADD COLUMN "company_id" uuid;--> statement-breakpoint
ALTER TABLE "password_reset_otps" ADD COLUMN "system_user_id" uuid;--> statement-breakpoint
ALTER TABLE "trips" ADD COLUMN "company_id" uuid;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "company_id" uuid;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "company_id" uuid;--> statement-breakpoint
ALTER TABLE "admin_audit_logs" ADD CONSTRAINT "admin_audit_logs_system_user_id_admin_system_users_id_fk" FOREIGN KEY ("system_user_id") REFERENCES "public"."admin_system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_company_id_admin_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."admin_companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_log_user_idx" ON "admin_audit_logs" USING btree ("system_user_id");--> statement-breakpoint
CREATE INDEX "audit_log_action_idx" ON "admin_audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "audit_log_entity_idx" ON "admin_audit_logs" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "company_status_idx" ON "admin_companies" USING btree ("status");--> statement-breakpoint
CREATE INDEX "company_email_idx" ON "admin_companies" USING btree ("contact_email");--> statement-breakpoint
CREATE INDEX "roles_company_idx" ON "roles" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "system_user_email_idx" ON "admin_system_users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "system_user_role_idx" ON "admin_system_users" USING btree ("role");--> statement-breakpoint
ALTER TABLE "password_reset_otps" ADD CONSTRAINT "password_reset_otps_system_user_id_admin_system_users_id_fk" FOREIGN KEY ("system_user_id") REFERENCES "public"."admin_system_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "drivers_company_idx" ON "drivers" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "maintenance_company_idx" ON "maintenance_records" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "trips_company_idx" ON "trips" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "company_idx" ON "users" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "vehicles_company_idx" ON "vehicles" USING btree ("company_id");