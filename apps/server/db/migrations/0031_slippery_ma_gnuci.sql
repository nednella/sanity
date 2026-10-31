ALTER TABLE "personal_bests" ADD COLUMN "source" "api_client" DEFAULT 'bot' NOT NULL;--> statement-breakpoint
ALTER TABLE "personal_bests" ALTER COLUMN "source" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "source" "api_client" DEFAULT 'bot' NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "source" DROP DEFAULT;
