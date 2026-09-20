import { sql } from "drizzle-orm";

import { members, personalBests, speedrunContent } from "@db/schema";

export const columns = {
  personalBest: personalBests,
  timeSeconds: sql<number>`extract(epoch from ${personalBests.time})::float8`,
  content: speedrunContent,
  submittedBy: { id: members.id, displayName: members.displayName }
};
