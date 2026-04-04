ALTER TABLE "ideas" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "ideas" ALTER COLUMN "status" SET DEFAULT 'en_revision'::text;--> statement-breakpoint
UPDATE "ideas" SET "status" = 'en_revision' WHERE "status" = 'pending';--> statement-breakpoint
UPDATE "ideas" SET "status" = 'planeado' WHERE "status" = 'planned';--> statement-breakpoint
UPDATE "ideas" SET "status" = 'completado' WHERE "status" = 'done';--> statement-breakpoint
DROP TYPE "public"."status";--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('en_revision', 'planeado', 'en_progreso', 'completado', 'descartado', 'archivado');--> statement-breakpoint
ALTER TABLE "ideas" ALTER COLUMN "status" SET DEFAULT 'en_revision'::"public"."status";--> statement-breakpoint
ALTER TABLE "ideas" ALTER COLUMN "status" SET DATA TYPE "public"."status" USING "status"::"public"."status";--> statement-breakpoint
ALTER TABLE "boards" ADD COLUMN "notify_new_ideas" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "tags" ADD COLUMN "description" text;