import { desc, eq } from "drizzle-orm";

import { db } from "@db/index";
import {
  womSnapshotActivities,
  womSnapshotBosses,
  womSnapshotComputed,
  womSnapshotSkills,
  womSnapshots
} from "@db/schema";

export const findLatestSnapshot = async (womPlayerId: number) => {
  const [snapshot] = await db
    .select()
    .from(womSnapshots)
    .where(eq(womSnapshots.womPlayerId, womPlayerId))
    .orderBy(desc(womSnapshots.createdAt))
    .limit(1);
  if (!snapshot) return;

  const computed = await db
    .select()
    .from(womSnapshotComputed)
    .where(eq(womSnapshotComputed.womSnapshotId, snapshot.id));

  const skills = await db.select().from(womSnapshotSkills).where(eq(womSnapshotSkills.womSnapshotId, snapshot.id));

  const bosses = await db.select().from(womSnapshotBosses).where(eq(womSnapshotBosses.womSnapshotId, snapshot.id));

  const activities = await db
    .select()
    .from(womSnapshotActivities)
    .where(eq(womSnapshotActivities.womSnapshotId, snapshot.id));

  return { snapshot, computed, skills, bosses, activities };
};

export type SnapshotRows = NonNullable<Awaited<ReturnType<typeof findLatestSnapshot>>>;
