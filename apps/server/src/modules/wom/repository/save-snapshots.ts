import { db } from "@db/index";
import {
  womSnapshotActivities,
  womSnapshotBosses,
  womSnapshotComputed,
  womSnapshotSkills,
  womSnapshots
} from "@db/schema";

import type { WomSnapshot } from "@/integrations/wom";

// Wise Old Man reports -1 for a value it doesn't know: a rank or count below the hiscore threshold, or
// efficiency on snapshots older than its rates. Unknown counts are left out rather than stored as -1.
const known = (value: number) => (value === -1 ? null : value);

const breakdown = (womSnapshotId: number, { skills, bosses, activities, computed }: WomSnapshot["data"]) => ({
  computed: Object.values(computed)
    .filter(({ value }) => value !== -1)
    .map(({ metric, rank, value }) => ({ womSnapshotId, metric, rank: known(rank), value })),
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

      const { activities, bosses, computed, skills } = breakdown(snapshot.id, data);
      if (computed.length > 0) await tx.insert(womSnapshotComputed).values(computed);
      if (skills.length > 0) await tx.insert(womSnapshotSkills).values(skills);
      if (bosses.length > 0) await tx.insert(womSnapshotBosses).values(bosses);
      if (activities.length > 0) await tx.insert(womSnapshotActivities).values(activities);
      saved++;
    }

    return saved;
  });
