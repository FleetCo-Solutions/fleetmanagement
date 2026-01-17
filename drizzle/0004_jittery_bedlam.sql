CREATE TABLE "driver_roles" (
	"driver_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	CONSTRAINT "driver_roles_driver_id_role_id_pk" PRIMARY KEY("driver_id","role_id")
);
--> statement-breakpoint
ALTER TABLE "driver_roles" ADD CONSTRAINT "driver_roles_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "driver_roles" ADD CONSTRAINT "driver_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;