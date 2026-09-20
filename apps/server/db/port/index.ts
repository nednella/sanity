import { type InferInsertModel, sql } from "drizzle-orm";
import { type PgTable } from "drizzle-orm/pg-core";

import { client, db } from "../index";
import * as schema from "../schema";
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
const insertAll = async <T extends PgTable>(table: T, rows: InferInsertModel<T>[], name: string) => {
  if (rows.length > 0) {
    const size = Math.max(1, Math.floor(64_000 / Object.keys(rows[0]!).length));
    for (let index = 0; index < rows.length; index += size) {
      await db.insert(table).values(rows.slice(index, index + size));
    }
  }
  report(name, rows);
};

await db.execute(sql`
  truncate ranks, members, members_discord_accounts, items, submissions, submission_participants,
           points, points_timeline_events, speedrun_content, speedrun_diary_tiers, speedrun_diary_times,
           speedrun_diary_rewards, personal_bests, personal_best_participants
  restart identity cascade
`);

await insertAll(schema.ranks, await readRanks(), "ranks");
await insertAll(schema.speedrunDiaryTiers, await readSpeedrunDiaryTiers(), "speedrun_diary_tiers");

// Everything downstream references members by the new id, not the snowflake. Each member is
// inserted alone so its generated id pairs with its Discord account.
const sourceMembers = await readMembers();
const memberIds = new Map<string, bigint>();
for (const { member, discordAccount } of sourceMembers) {
  const [inserted] = await db.insert(schema.members).values(member).returning({ id: schema.members.id });
  await db.insert(schema.membersDiscordAccounts).values({ memberId: inserted!.id, ...discordAccount });
  memberIds.set(discordAccount.discordId.toString(), inserted!.id);
}
report("members", sourceMembers);
report("members_discord_accounts", sourceMembers);

const items = await readItems();
await insertAll(schema.items, items, "items");
const itemIds = new Map(items.map((item) => [item.name.trim().toLowerCase(), item.id]));

await insertAll(schema.submissions, await readSubmissions(memberIds, itemIds), "submissions");
await insertAll(schema.submissionParticipants, await readSubmissionParticipants(memberIds), "submission_participants");
await insertAll(schema.points, await readPoints(memberIds), "points");
await insertAll(schema.pointsTimelineEvents, await readPointsTimelineEvents(), "points_timeline_events");

await insertAll(schema.speedrunContent, await readSpeedrunContent(), "speedrun_content");
await insertAll(schema.speedrunDiaryTimes, await readSpeedrunDiaryTimes(), "speedrun_diary_times");
await insertAll(schema.speedrunDiaryRewards, await readSpeedrunDiaryRewards(), "speedrun_diary_rewards");
const personalBests = await readPersonalBests(memberIds);
await insertAll(schema.personalBests, personalBests, "personal_bests");

const keptIds = new Set(personalBests.map((best) => best.id));
const participants = await readPersonalBestParticipants(memberIds, keptIds);
await insertAll(schema.personalBestParticipants, participants, "personal_best_participants");

// Rows carrying their source id leave the identity sequence behind, so the next
// insert would collide. Move each one past the highest id present.
for (const table of [
  "items",
  "submissions",
  "points",
  "points_timeline_events",
  "speedrun_content",
  "personal_bests"
]) {
  await db.execute(
    sql`select setval(pg_get_serial_sequence(${table}, 'id'), coalesce((select max(id) from ${sql.identifier(table)}), 1))`
  );
}

await source.end();
await client.end();
