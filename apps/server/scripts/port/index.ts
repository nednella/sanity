import { type InferInsertModel, and, eq, ne, sql } from "drizzle-orm";
import { type PgTable } from "drizzle-orm/pg-core";

import { type Transaction, client, db } from "@db/index";
import * as schema from "@db/schema";

import { readAuditLog } from "./audit";
import { readMembers, readRanks } from "./members";
import {
  readPersonalBestParticipants,
  readPersonalBests,
  readSpeedrunContent,
  readSpeedrunDiaryRewards,
  readSpeedrunDiaryTiers,
  readSpeedrunDiaryTimes
} from "./records";
import { source } from "./source";
import {
  readItems,
  readPoints,
  readPointsTimelineEvents,
  readSubmissionParticipants,
  readSubmissions
} from "./submissions";

// Fills the new schema from a snapshot of the old database. Re-runnable: it
// empties every table it fills first. Not a migration; migrations build the
// shape, this moves data into it once, at cutover.

const report = (table: string, rows: unknown[]) => console.log(`${String(rows.length).padStart(6)}  ${table}`);

// Postgres allows 65535 parameters per statement, and every column of every row
// is one, so wide tables need smaller batches.
const insertAll = async <T extends PgTable>(tx: Transaction, table: T, rows: InferInsertModel<T>[], name: string) => {
  if (rows.length > 0) {
    const size = Math.max(1, Math.floor(64_000 / Object.keys(rows[0]!).length));
    for (let index = 0; index < rows.length; index += size) {
      await tx.insert(table).values(rows.slice(index, index + size));
    }
  }
  report(name, rows);
};

await db.transaction(async (tx) => {
  // Live audit entries exist only here. The old database cannot replay them, so a re-run after
  // cutover would erase history nothing can restore. Catalogue changes are the exception: the seed
  // scripts write them, and they have to run before this one.
  const [live] = await tx
    .select({ value: sql<number>`count(*)::int` })
    .from(schema.auditLog)
    .where(and(eq(schema.auditLog.source, "server"), ne(schema.auditLog.action, "catalogue_changed")));

  if ((live?.value ?? 0) > 0) {
    throw new Error(`refusing to run: ${live?.value} audit entries were written after the port`);
  }

  // Named in full rather than cascaded. Truncate follows every foreign key when told to cascade, which
  // reaches the Wise Old Man tables this script never refills; without it, a table we forget is an
  // error rather than silent loss.
  await tx.execute(sql`
    truncate audit_log, audit_log_members, boss_uniques, items, members, members_discord_accounts,
             personal_best_participants, personal_bests, points, points_timeline_events, ranks,
             speedrun_content, speedrun_diary_rewards, speedrun_diary_tiers, speedrun_diary_times,
             submission_participants, submissions, wom_name_changes, wom_players,
             wom_snapshot_activities, wom_snapshot_bosses, wom_snapshot_computed, wom_snapshot_skills,
             wom_snapshots
    restart identity
  `);

  await insertAll(tx, schema.ranks, await readRanks(), "ranks");
  await insertAll(tx, schema.speedrunDiaryTiers, await readSpeedrunDiaryTiers(), "speedrun_diary_tiers");

  // Everything downstream references members by the new id, not the snowflake. Each member is
  // inserted alone so its generated id pairs with its Discord account.
  const sourceMembers = await readMembers();
  const memberIds = new Map<string, bigint>();
  for (const { member, discordAccount } of sourceMembers) {
    const [inserted] = await tx.insert(schema.members).values(member).returning({ id: schema.members.id });
    await tx.insert(schema.membersDiscordAccounts).values({ memberId: inserted!.id, ...discordAccount });
    memberIds.set(discordAccount.discordId.toString(), inserted!.id);
  }
  report("members", sourceMembers);
  report("members_discord_accounts", sourceMembers);

  const items = await readItems();
  await insertAll(tx, schema.items, items, "items");
  const itemIds = new Map(items.map((item) => [item.name.trim().toLowerCase(), item.id]));

  await insertAll(tx, schema.submissions, await readSubmissions(memberIds, itemIds), "submissions");
  await insertAll(
    tx,
    schema.submissionParticipants,
    await readSubmissionParticipants(memberIds),
    "submission_participants"
  );
  await insertAll(tx, schema.points, await readPoints(memberIds), "points");
  await insertAll(tx, schema.pointsTimelineEvents, await readPointsTimelineEvents(), "points_timeline_events");

  await insertAll(tx, schema.speedrunContent, await readSpeedrunContent(), "speedrun_content");
  await insertAll(tx, schema.speedrunDiaryTimes, await readSpeedrunDiaryTimes(), "speedrun_diary_times");
  await insertAll(tx, schema.speedrunDiaryRewards, await readSpeedrunDiaryRewards(), "speedrun_diary_rewards");
  const personalBests = await readPersonalBests(memberIds);
  await insertAll(tx, schema.personalBests, personalBests, "personal_bests");

  const keptIds = new Set(personalBests.map((best) => best.id));
  const participants = await readPersonalBestParticipants(memberIds, keptIds);
  await insertAll(tx, schema.personalBestParticipants, participants, "personal_best_participants");

  const audit = await readAuditLog(memberIds);
  await insertAll(
    tx,
    schema.auditLog,
    audit.map(({ entry }) => entry),
    "audit_log"
  );
  await insertAll(
    tx,
    schema.auditLogMembers,
    audit.flatMap(({ affects, entry }) => affects.map((memberId) => ({ auditLogId: entry.id, memberId }))),
    "audit_log_members"
  );

  // Rows carrying their source id leave the identity sequence behind, so the next
  // insert would collide. Move each one past the highest id present.
  for (const table of [
    "audit_log",
    "items",
    "submissions",
    "points",
    "points_timeline_events",
    "speedrun_content",
    "personal_bests"
  ]) {
    await tx.execute(
      sql`select setval(pg_get_serial_sequence(${table}, 'id'), coalesce((select max(id) from ${sql.identifier(table)}), 1))`
    );
  }
});

await source.end();
await client.end();
