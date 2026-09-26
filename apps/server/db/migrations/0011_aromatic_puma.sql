CREATE TABLE "wom_name_changes" (
	"id" integer PRIMARY KEY NOT NULL,
	"wom_player_id" integer NOT NULL,
	"old_name" text NOT NULL,
	"new_name" text NOT NULL,
	"resolved_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "wom_name_changes" ADD CONSTRAINT "wom_name_changes_wom_player_id_wom_players_wom_player_id_fk" FOREIGN KEY ("wom_player_id") REFERENCES "public"."wom_players"("wom_player_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "wom_name_changes_wom_player_id_resolved_at_index" ON "wom_name_changes" USING btree ("wom_player_id","resolved_at" DESC NULLS LAST);