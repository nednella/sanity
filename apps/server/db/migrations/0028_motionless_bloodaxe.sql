CREATE TYPE "public"."member_role" AS ENUM('admin', 'superuser');--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "role" "member_role";