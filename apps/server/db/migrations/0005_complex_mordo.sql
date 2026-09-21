ALTER TABLE "wom_players" ADD COLUMN "status" text;--> statement-breakpoint
ALTER TABLE "wom_players" ADD COLUMN "time_to_max" double precision;--> statement-breakpoint
ALTER TABLE "wom_players" ADD COLUMN "time_to_200m" double precision;--> statement-breakpoint
ALTER TABLE "wom_players" ADD COLUMN "last_changed_at" timestamp with time zone;