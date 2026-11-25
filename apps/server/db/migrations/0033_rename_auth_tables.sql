ALTER TABLE "api_keys" RENAME TO "auth_keys";--> statement-breakpoint
ALTER SEQUENCE "api_keys_id_seq" RENAME TO "auth_keys_id_seq";--> statement-breakpoint
ALTER TABLE "auth_keys" RENAME CONSTRAINT "api_keys_pkey" TO "auth_keys_pkey";--> statement-breakpoint
ALTER TABLE "auth_keys" RENAME CONSTRAINT "api_keys_key_hash_unique" TO "auth_keys_key_hash_unique";--> statement-breakpoint
ALTER TABLE "auth_keys" RENAME CONSTRAINT "api_keys_member_key" TO "auth_keys_member_key";--> statement-breakpoint
ALTER TABLE "auth_keys" RENAME CONSTRAINT "api_keys_member_id_members_id_fk" TO "auth_keys_member_id_members_id_fk";--> statement-breakpoint
ALTER INDEX "api_keys_member_id_index" RENAME TO "auth_keys_member_id_index";--> statement-breakpoint
ALTER TABLE "sessions" RENAME TO "auth_sessions";--> statement-breakpoint
ALTER SEQUENCE "sessions_id_seq" RENAME TO "auth_sessions_id_seq";--> statement-breakpoint
ALTER TABLE "auth_sessions" RENAME CONSTRAINT "sessions_pkey" TO "auth_sessions_pkey";--> statement-breakpoint
ALTER TABLE "auth_sessions" RENAME CONSTRAINT "sessions_secret_hash_unique" TO "auth_sessions_secret_hash_unique";--> statement-breakpoint
ALTER TABLE "auth_sessions" RENAME CONSTRAINT "sessions_member_id_members_id_fk" TO "auth_sessions_member_id_members_id_fk";--> statement-breakpoint
ALTER INDEX "sessions_member_id_index" RENAME TO "auth_sessions_member_id_index";
