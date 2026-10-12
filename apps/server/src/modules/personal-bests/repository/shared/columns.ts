import { bosses, members, personalBests, speedrunContent } from "@db/schema";

import { epochSeconds } from "@/utils/sql";

export const columns = {
  personalBest: personalBests,
  timeSeconds: epochSeconds(personalBests.time),
  content: {
    id: speedrunContent.id,
    name: bosses.name,
    metric: bosses.womMetric,
    imageUrl: speedrunContent.imageUrl
  },
  submittedBy: { id: members.id, displayName: members.displayName }
};
