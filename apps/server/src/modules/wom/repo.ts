import { desc, eq, isNotNull, sql } from "drizzle-orm";

import { db } from "../../../db/index.js";
import {
  members,
  womPlayers,
  womSnapshotActivities,
  womSnapshotBosses,
  womSnapshotSkills,
  womSnapshots
} from "../../../db/schema.js";
import type { WomPlayer, WomSnapshot } from "../../integrations/wom.js";

// OSRS treats spaces, underscores and hyphens in a name as the same character.
const normalise = (name: string) => name.toLowerCase().replaceAll(/[_-]/g, " ").trim();

// Wise Old Man reports -1 for a value it doesn't know: a rank or count below the hiscore threshold, or
// efficiency on snapshots older than its rates. Unknown counts are left out rather than stored as -1.
const known = (value: number) => (value === -1 ? null : value);

const breakdown = (womSnapshotId: number, { skills, bosses, activities }: WomSnapshot["data"]) => ({
  skills: Object.values(skills)
    .filter(({ experience }) => experience !== -1)
    .map(({ metric, rank, ...values }) => ({ womSnapshotId, skill: metric, rank: known(rank), ...values })),
  bosses: Object.values(bosses)
    .filter(({ kills }) => kills !== -1)
    .map(({ metric, rank, ...values }) => ({ womSnapshotId, boss: metric, rank: known(rank), ...values })),
  activities: Object.values(activities)
    .filter(({ score }) => score !== -1)
    .map(({ metric, rank, ...values }) => ({ womSnapshotId, activity: metric, rank: known(rank), ...values }))
});

export const loadMemberMatcher = async () => {
  const linked = await db
    .select({ womPlayerId: womPlayers.womPlayerId, memberId: womPlayers.memberId })
    .from(womPlayers);
  const byPlayerId = new Map(linked.map((row) => [row.womPlayerId, row.memberId]));

  const named = await db
    .select({ id: members.id, mainRsn: members.mainRsn })
    .from(members)
    .where(isNotNull(members.mainRsn));
  const byRsn = new Map(named.map((row) => [normalise(row.mainRsn!), row.id]));

  // The player id survives a name change, so an existing link wins over the RSN.
  return (player: WomPlayer) => byPlayerId.get(player.id) ?? byRsn.get(normalise(player.username));
};

export const savePlayers = async (players: { memberId: bigint; player: WomPlayer; snapshot: WomSnapshot }[]) => {
  const rows = players.map(({ memberId, player, snapshot }) => ({
    womPlayerId: player.id,
    memberId,
    username: player.username,
    displayName: player.displayName,
    type: player.type,
    build: player.build,
    totalLevel: snapshot.data.skills.overall!.level,
    totalExp: player.exp,
    totalEhp: player.ehp,
    totalEhb: player.ehb,
    registeredAt: new Date(player.registeredAt),
    updatedAt: player.updatedAt ? new Date(player.updatedAt) : null
  }));

  await db
    .insert(womPlayers)
    .values(rows)
    .onConflictDoUpdate({
      target: womPlayers.womPlayerId,
      set: {
        username: sql`excluded.username`,
        displayName: sql`excluded.display_name`,
        type: sql`excluded.type`,
        build: sql`excluded.build`,
        totalLevel: sql`excluded.total_level`,
        totalExp: sql`excluded.total_exp`,
        totalEhp: sql`excluded.total_ehp`,
        totalEhb: sql`excluded.total_ehb`,
        updatedAt: sql`excluded.updated_at`
      }
    });
};

// Snapshots already stored are skipped, so overlapping pulls are safe. Returns how many were new.
export const saveSnapshots = (snapshots: WomSnapshot[]) =>
  db.transaction(async (tx) => {
    let saved = 0;

    for (const { playerId, createdAt, data } of snapshots) {
      const [snapshot] = await tx
        .insert(womSnapshots)
        .values({
          womPlayerId: playerId,
          totalExp: data.skills.overall!.experience,
          totalEhp: known(data.computed.ehp.value),
          totalEhb: known(data.computed.ehb.value),
          createdAt: new Date(createdAt)
        })
        .onConflictDoNothing()
        .returning({ id: womSnapshots.id });
      if (!snapshot) continue;

      const { skills, bosses, activities } = breakdown(snapshot.id, data);
      if (skills.length > 0) await tx.insert(womSnapshotSkills).values(skills);
      if (bosses.length > 0) await tx.insert(womSnapshotBosses).values(bosses);
      if (activities.length > 0) await tx.insert(womSnapshotActivities).values(activities);
      saved++;
    }

    return saved;
  });

export const findLatestSnapshot = async (womPlayerId: number) => {
  const [snapshot] = await db
    .select()
    .from(womSnapshots)
    .where(eq(womSnapshots.womPlayerId, womPlayerId))
    .orderBy(desc(womSnapshots.createdAt))
    .limit(1);
  if (!snapshot) return;

  const skills = await db
    .select()
    .from(womSnapshotSkills)
    .where(eq(womSnapshotSkills.womSnapshotId, snapshot.id))
    .orderBy(desc(womSnapshotSkills.experience));

  const bosses = await db
    .select()
    .from(womSnapshotBosses)
    .where(eq(womSnapshotBosses.womSnapshotId, snapshot.id))
    .orderBy(desc(womSnapshotBosses.kills));

  const activities = await db
    .select()
    .from(womSnapshotActivities)
    .where(eq(womSnapshotActivities.womSnapshotId, snapshot.id))
    .orderBy(desc(womSnapshotActivities.score));

  return { snapshot, skills, bosses, activities };
};
