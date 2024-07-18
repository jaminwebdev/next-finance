ALTER TABLE "transactions" ADD COLUMN "date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" DROP COLUMN IF EXISTS "dat";