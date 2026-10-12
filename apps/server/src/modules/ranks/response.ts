import { z } from "zod";

import { bigIntString } from "@/schema/codecs";

const requirements = z.object({
  clanPoints: z.number(),
  diaryPoints: z.number(),
  masterDiaries: z.number()
});

export const rankSummary = z
  .object({
    id: z.number(),
    name: z.string(),
    iconUrl: z.string().nullable()
  })
  .register(z.globalRegistry, { id: "RankSummary" });

export const rank = rankSummary
  .extend({
    discordRoleId: bigIntString.nullable(),
    requirements
  })
  .register(z.globalRegistry, { id: "Rank" });
