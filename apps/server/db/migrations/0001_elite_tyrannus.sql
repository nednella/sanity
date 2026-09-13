CREATE TABLE "wom_players" (
	"wom_player_id" integer PRIMARY KEY NOT NULL,
	"member_id" bigint NOT NULL,
	"username" text NOT NULL,
	"display_name" text NOT NULL,
	"type" text NOT NULL,
	"build" text NOT NULL,
	"total_exp" bigint NOT NULL,
	"total_ehp" double precision NOT NULL,
	"total_ehb" double precision NOT NULL,
	"registered_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "wom_players_member_id_unique" UNIQUE("member_id")
);
--> statement-breakpoint
CREATE TABLE "wom_snapshot_activities" (
	"wom_snapshot_id" integer NOT NULL,
	"activity" text NOT NULL,
	"score" integer NOT NULL,
	"rank" integer,
	CONSTRAINT "wom_snapshot_activities_wom_snapshot_id_activity_pk" PRIMARY KEY("wom_snapshot_id","activity")
);
--> statement-breakpoint
CREATE TABLE "wom_snapshot_bosses" (
	"wom_snapshot_id" integer NOT NULL,
	"boss" text NOT NULL,
	"kills" integer NOT NULL,
	"rank" integer,
	"ehb" double precision NOT NULL,
	CONSTRAINT "wom_snapshot_bosses_wom_snapshot_id_boss_pk" PRIMARY KEY("wom_snapshot_id","boss")
);
--> statement-breakpoint
CREATE TABLE "wom_snapshot_skills" (
	"wom_snapshot_id" integer NOT NULL,
	"skill" text NOT NULL,
	"experience" bigint NOT NULL,
	"level" smallint NOT NULL,
	"rank" integer,
	"ehp" double precision NOT NULL,
	CONSTRAINT "wom_snapshot_skills_wom_snapshot_id_skill_pk" PRIMARY KEY("wom_snapshot_id","skill")
);
--> statement-breakpoint
CREATE TABLE "wom_snapshots" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "wom_snapshots_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"wom_player_id" integer NOT NULL,
	"total_exp" bigint NOT NULL,
	"total_ehp" double precision,
	"total_ehb" double precision,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "wom_snapshots_wom_player_id_created_at_unique" UNIQUE("wom_player_id","created_at")
);
--> statement-breakpoint
ALTER TABLE "wom_players" ADD CONSTRAINT "wom_players_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wom_snapshot_activities" ADD CONSTRAINT "wom_snapshot_activities_wom_snapshot_id_wom_snapshots_id_fk" FOREIGN KEY ("wom_snapshot_id") REFERENCES "public"."wom_snapshots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wom_snapshot_bosses" ADD CONSTRAINT "wom_snapshot_bosses_wom_snapshot_id_wom_snapshots_id_fk" FOREIGN KEY ("wom_snapshot_id") REFERENCES "public"."wom_snapshots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wom_snapshot_skills" ADD CONSTRAINT "wom_snapshot_skills_wom_snapshot_id_wom_snapshots_id_fk" FOREIGN KEY ("wom_snapshot_id") REFERENCES "public"."wom_snapshots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wom_snapshots" ADD CONSTRAINT "wom_snapshots_wom_player_id_wom_players_wom_player_id_fk" FOREIGN KEY ("wom_player_id") REFERENCES "public"."wom_players"("wom_player_id") ON DELETE cascade ON UPDATE no action;