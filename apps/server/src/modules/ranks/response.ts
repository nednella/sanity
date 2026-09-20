import { z } from "zod";

import { bigIntString } from "@/schema/codecs";

const requirements = z.object({
  clanPoints: z.number(),
  diaryPoints: z.number(),
  masterDiaries: z.number(),
  maintenancePoints: z.number()
});

export const rank = z.object({
  id: z.number(),
  name: z.string(),
  iconUrl: z.string().nullable(),
  discordRoleId: bigIntString.nullable(),
  requirements
});
