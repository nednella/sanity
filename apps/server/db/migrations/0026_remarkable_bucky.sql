CREATE TYPE "public"."api_client" AS ENUM('bot', 'runelite', 'web');--> statement-breakpoint
ALTER TYPE "public"."audit_source" ADD VALUE 'runelite' BEFORE 'server';--> statement-breakpoint
CREATE TABLE "api_keys" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "api_keys_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"client" "api_client" NOT NULL,
	"member_id" bigint,
	"key_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_used_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	CONSTRAINT "api_keys_key_hash_unique" UNIQUE("key_hash"),
	CONSTRAINT "api_keys_member_key" CHECK (("api_keys"."client" = 'runelite') = ("api_keys"."member_id" is not null))
);
--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "api_keys_member_id_index" ON "api_keys" USING btree ("member_id");