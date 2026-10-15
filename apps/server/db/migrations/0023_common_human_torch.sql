CREATE TYPE "public"."item_value_rule" AS ENUM('exact', 'minimum');--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "value_millions" integer;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "value_rule" "item_value_rule";