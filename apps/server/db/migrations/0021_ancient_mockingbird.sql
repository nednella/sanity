ALTER TABLE "audit_log" DROP CONSTRAINT "audit_log_acting_member_id_members_id_fk";
--> statement-breakpoint
ALTER TABLE "members" DROP CONSTRAINT "members_rank_id_ranks_id_fk";
--> statement-breakpoint
ALTER TABLE "members" DROP CONSTRAINT "members_claimed_diary_tier_id_speedrun_diary_tiers_id_fk";
--> statement-breakpoint
ALTER TABLE "personal_best_participants" DROP CONSTRAINT "personal_best_participants_member_id_members_id_fk";
--> statement-breakpoint
ALTER TABLE "personal_bests" DROP CONSTRAINT "personal_bests_member_id_members_id_fk";
--> statement-breakpoint
ALTER TABLE "personal_bests" DROP CONSTRAINT "personal_bests_content_id_speedrun_content_id_fk";
--> statement-breakpoint
ALTER TABLE "personal_bests" DROP CONSTRAINT "personal_bests_reviewed_by_members_id_fk";
--> statement-breakpoint
ALTER TABLE "points" DROP CONSTRAINT "points_member_id_members_id_fk";
--> statement-breakpoint
ALTER TABLE "points" DROP CONSTRAINT "points_submission_id_submissions_id_fk";
--> statement-breakpoint
ALTER TABLE "points" DROP CONSTRAINT "points_awarded_by_members_id_fk";
--> statement-breakpoint
ALTER TABLE "speedrun_content" DROP CONSTRAINT "speedrun_content_boss_id_bosses_id_fk";
--> statement-breakpoint
ALTER TABLE "speedrun_diary_rewards" DROP CONSTRAINT "speedrun_diary_rewards_tier_id_speedrun_diary_tiers_id_fk";
--> statement-breakpoint
ALTER TABLE "speedrun_diary_times" DROP CONSTRAINT "speedrun_diary_times_content_id_speedrun_content_id_fk";
--> statement-breakpoint
ALTER TABLE "speedrun_diary_times" DROP CONSTRAINT "speedrun_diary_times_tier_id_speedrun_diary_tiers_id_fk";
--> statement-breakpoint
ALTER TABLE "submission_participants" DROP CONSTRAINT "submission_participants_member_id_members_id_fk";
--> statement-breakpoint
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_member_id_members_id_fk";
--> statement-breakpoint
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_item_id_items_id_fk";
--> statement-breakpoint
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_reviewed_by_members_id_fk";
--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_acting_member_id_members_id_fk" FOREIGN KEY ("acting_member_id") REFERENCES "public"."members"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_rank_id_ranks_id_fk" FOREIGN KEY ("rank_id") REFERENCES "public"."ranks"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_claimed_diary_tier_id_speedrun_diary_tiers_id_fk" FOREIGN KEY ("claimed_diary_tier_id") REFERENCES "public"."speedrun_diary_tiers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personal_best_participants" ADD CONSTRAINT "personal_best_participants_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personal_bests" ADD CONSTRAINT "personal_bests_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personal_bests" ADD CONSTRAINT "personal_bests_content_id_speedrun_content_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."speedrun_content"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personal_bests" ADD CONSTRAINT "personal_bests_reviewed_by_members_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."members"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "points" ADD CONSTRAINT "points_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "points" ADD CONSTRAINT "points_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "points" ADD CONSTRAINT "points_awarded_by_members_id_fk" FOREIGN KEY ("awarded_by") REFERENCES "public"."members"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "speedrun_content" ADD CONSTRAINT "speedrun_content_boss_id_bosses_id_fk" FOREIGN KEY ("boss_id") REFERENCES "public"."bosses"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "speedrun_diary_rewards" ADD CONSTRAINT "speedrun_diary_rewards_tier_id_speedrun_diary_tiers_id_fk" FOREIGN KEY ("tier_id") REFERENCES "public"."speedrun_diary_tiers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "speedrun_diary_times" ADD CONSTRAINT "speedrun_diary_times_content_id_speedrun_content_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."speedrun_content"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "speedrun_diary_times" ADD CONSTRAINT "speedrun_diary_times_tier_id_speedrun_diary_tiers_id_fk" FOREIGN KEY ("tier_id") REFERENCES "public"."speedrun_diary_tiers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_participants" ADD CONSTRAINT "submission_participants_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_reviewed_by_members_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."members"("id") ON DELETE restrict ON UPDATE no action;