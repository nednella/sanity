CREATE TABLE "member_rank_delays" (
	"member_id" bigint PRIMARY KEY NOT NULL,
	"until" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "member_rank_delays" ADD CONSTRAINT "member_rank_delays_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;