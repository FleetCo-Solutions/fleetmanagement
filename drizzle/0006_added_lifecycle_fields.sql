ALTER TABLE "vehicles" ADD COLUMN "inServiceDate" timestamp with time zone;
ALTER TABLE "vehicles" ADD COLUMN "inServiceOdometer" real;
ALTER TABLE "vehicles" ADD COLUMN "estimatedServiceLifeMonths" varchar(10);
ALTER TABLE "vehicles" ADD COLUMN "estimatedServiceLifeMeter" real;
ALTER TABLE "vehicles" ADD COLUMN "estimatedResaleValue" real;
ALTER TABLE "vehicles" ADD COLUMN "outOfServiceDate" timestamp with time zone;
ALTER TABLE "vehicles" ADD COLUMN "outOfServiceOdometer" real;
