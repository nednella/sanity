import { sql } from "drizzle-orm";

import { bosses, members, personalBests, speedrunContent } from "@db/schema";

export const columns = {
  personalBest: personalBests,
  timeSeconds: sql<number>`extract(epoch from ${personalBests.time})::float8`,
  content: {
    id: speedrunContent.id,
    name: bosses.name,
    metric: bosses.womMetric,
    imageUrl: speedrunContent.imageUrl
  },
  submittedBy: { id: members.id, displayName: members.displayName }
};
