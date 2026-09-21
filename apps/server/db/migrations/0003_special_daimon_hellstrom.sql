CREATE TABLE "wom_snapshot_computed" (
	"wom_snapshot_id" integer NOT NULL,
	"metric" text NOT NULL,
	"value" double precision NOT NULL,
	"rank" integer,
	CONSTRAINT "wom_snapshot_computed_wom_snapshot_id_metric_pk" PRIMARY KEY("wom_snapshot_id","metric")
);
--> statement-breakpoint
ALTER TABLE "wom_snapshot_computed" ADD CONSTRAINT "wom_snapshot_computed_wom_snapshot_id_wom_snapshots_id_fk" FOREIGN KEY ("wom_snapshot_id") REFERENCES "public"."wom_snapshots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
INSERT INTO "wom_snapshot_computed" ("wom_snapshot_id", "metric", "value")
SELECT "id", 'ehp', "total_ehp" FROM "wom_snapshots" WHERE "total_ehp" IS NOT NULL;--> statement-breakpoint
INSERT INTO "wom_snapshot_computed" ("wom_snapshot_id", "metric", "value")
SELECT "id", 'ehb', "total_ehb" FROM "wom_snapshots" WHERE "total_ehb" IS NOT NULL;
