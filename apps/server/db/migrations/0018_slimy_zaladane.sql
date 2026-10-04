ALTER TABLE "members" ALTER COLUMN "nationality" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "members" ALTER COLUMN "nationality" DROP NOT NULL;--> statement-breakpoint
UPDATE "members" SET "nationality" = NULL WHERE "nationality" = 'AQ';
