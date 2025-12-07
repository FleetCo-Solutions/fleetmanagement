CREATE TYPE "public"."driver_role" AS ENUM('main', 'substitute');--> statement-breakpoint
CREATE TYPE "public"."relationship" AS ENUM('parent', 'spouse', 'sibling', 'friend', 'other');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'inactive', 'suspended');--> statement-breakpoint
CREATE TABLE "drivers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firstName" varchar(50) NOT NULL,
	"lastName" varchar(50) NOT NULL,
	"phoneNumber" varchar(20) NOT NULL,
	"alternativePhone" varchar(20),
	"licenseNumber" varchar(29) NOT NULL,
	"licenseExpiry" varchar(15) NOT NULL,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"passwordHash" varchar(255) DEFAULT 'Welcome@123' NOT NULL,
	"role" "driver_role" DEFAULT 'substitute' NOT NULL,
	"vehicleId" uuid,
	"lastLogin" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone,
	"deletedAt" timestamp with time zone,
	CONSTRAINT "drivers_phoneNumber_unique" UNIQUE("phoneNumber"),
	CONSTRAINT "drivers_alternativePhone_unique" UNIQUE("alternativePhone"),
	CONSTRAINT "drivers_licenseNumber_unique" UNIQUE("licenseNumber")
);
--> statement-breakpoint
CREATE TABLE "emergency_contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"relationship" "relationship" NOT NULL,
	"address" varchar(255),
	"phone" varchar(15) NOT NULL,
	"email" varchar(100),
	"alternative_no" varchar(15),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"user_id" uuid,
	"driver_id" uuid,
	"deleted" boolean DEFAULT false,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "password_reset_otps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"email" varchar(100) NOT NULL,
	"otp" varchar(6) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"phone" varchar(20),
	"email" varchar(100) NOT NULL,
	"password_hash" varchar(255) DEFAULT 'Welcome@123' NOT NULL,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"last_login" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "users_phone_unique" UNIQUE("phone"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"registrationNumber" varchar(15) NOT NULL,
	"model" varchar(30) NOT NULL,
	"manufacturer" varchar(30) NOT NULL,
	"vin" varchar(20) NOT NULL,
	"color" varchar(20) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone,
	"deletedAt" timestamp with time zone,
	CONSTRAINT "vehicles_registrationNumber_unique" UNIQUE("registrationNumber"),
	CONSTRAINT "vehicles_vin_unique" UNIQUE("vin")
);
--> statement-breakpoint
ALTER TABLE "emergency_contacts" ADD CONSTRAINT "emergency_contacts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emergency_contacts" ADD CONSTRAINT "emergency_contacts_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_otps" ADD CONSTRAINT "password_reset_otps_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "licenseNumberIdx" ON "drivers" USING btree ("licenseNumber");--> statement-breakpoint
CREATE INDEX "user_idx" ON "emergency_contacts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "driver_idx" ON "emergency_contacts" USING btree ("driver_id");--> statement-breakpoint
CREATE INDEX "otp_email_idx" ON "password_reset_otps" USING btree ("email");--> statement-breakpoint
CREATE INDEX "email_idx" ON "users" USING btree ("email");