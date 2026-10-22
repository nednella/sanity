ALTER TABLE "members_discord_accounts" RENAME TO "discord_accounts";--> statement-breakpoint
ALTER TABLE "discord_accounts" DROP CONSTRAINT "members_discord_accounts_discord_id_unique";--> statement-breakpoint
ALTER TABLE "discord_accounts" DROP CONSTRAINT "members_discord_accounts_member_id_members_id_fk";
--> statement-breakpoint
ALTER TABLE "discord_accounts" ADD CONSTRAINT "discord_accounts_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discord_accounts" ADD CONSTRAINT "discord_accounts_discord_id_unique" UNIQUE("discord_id");