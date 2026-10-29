import type { SnapshotResponse } from "@wise-old-man/utils";

import type { Transaction } from "@db/index";
import {
  womSnapshotActivities,
  womSnapshotBosses,
  womSnapshotComputed,
  womSnapshotSkills,
  womSnapshots
} from "@db/schema";

// Postgres takes at most 65,535 parameters in one statement, and the bosses of one snapshot alone can
// use about 350.
const SNAPSHOTS_PER_BATCH = 100;

// Wise Old Man reports -1 for a value it doesn't know: a rank or count below the hiscore threshold, or
// efficiency on snapshots older than its rates. Unknown counts are left out rather than stored as -1.
function unknownAsNull(value: number) {
  return value === -1 ? null : value;
}

function toSnapshotRows(womSnapshotId: number, { skills, bosses, activities, computed }: SnapshotResponse["data"]) {
  return {
    computed: Object.values(computed)
      .filter(({ value }) => value !== -1)
      .map(({ metric, rank, value }) => ({ womSnapshotId, metric, rank: unknownAsNull(rank), value })),
    skills: Object.values(skills)
      .filter(({ experience }) => experience !== -1)
      .map(({ metric, rank, ...values }) => ({ womSnapshotId, skill: metric, rank: unknownAsNull(rank), ...values })),
    bosses: Object.values(bosses)
      .filter(({ kills }) => kills !== -1)
      .map(({ metric, rank, ...values }) => ({ womSnapshotId, boss: metric, rank: unknownAsNull(rank), ...values })),
    activities: Object.values(activities)
      .filter(({ score }) => score !== -1)
      .map(({ metric, rank, ...values }) => ({ womSnapshotId, activity: metric, rank: unknownAsNull(rank), ...values }))
  };
}

async function saveSnapshotBatch(tx: Transaction, snapshots: SnapshotResponse[]) {
  const saved = await tx
    .insert(womSnapshots)
    .values(snapshots.map(({ playerId, createdAt }) => ({ womPlayerId: playerId, createdAt })))
    .onConflictDoNothing()
    .returning({
      id: womSnapshots.id,
      womPlayerId: womSnapshots.womPlayerId,
      createdAt: womSnapshots.createdAt
    });

  const idFor = new Map(saved.map(({ id, womPlayerId, createdAt }) => [`${womPlayerId}:${createdAt.getTime()}`, id]));
  const rows = snapshots.flatMap(({ playerId, createdAt, data }) => {
    const id = idFor.get(`${playerId}:${createdAt.getTime()}`);
    return id === undefined ? [] : [toSnapshotRows(id, data)];
  });

  const computed = rows.flatMap((row) => row.computed);
  const skills = rows.flatMap((row) => row.skills);
  const bosses = rows.flatMap((row) => row.bosses);
  const activities = rows.flatMap((row) => row.activities);
  if (computed.length > 0) await tx.insert(womSnapshotComputed).values(computed);
  if (skills.length > 0) await tx.insert(womSnapshotSkills).values(skills);
  if (bosses.length > 0) await tx.insert(womSnapshotBosses).values(bosses);
  if (activities.length > 0) await tx.insert(womSnapshotActivities).values(activities);

  return saved.length;
}

// Snapshots already stored are skipped, so overlapping pulls are safe. Returns how many were new.
export async function saveSnapshots(tx: Transaction, snapshots: SnapshotResponse[]) {
  let saved = 0;
  for (let start = 0; start < snapshots.length; start += SNAPSHOTS_PER_BATCH) {
    saved += await saveSnapshotBatch(tx, snapshots.slice(start, start + SNAPSHOTS_PER_BATCH));
  }
  return saved;
}
