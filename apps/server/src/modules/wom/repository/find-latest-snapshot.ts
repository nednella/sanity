import { desc, eq } from "drizzle-orm";

import { db } from "@db/index";
import { womSnapshotActivities, womSnapshotBosses, womSnapshotSkills, womSnapshots } from "@db/schema";

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

export type SnapshotRows = NonNullable<Awaited<ReturnType<typeof findLatestSnapshot>>>;
