import { z } from "zod";

import { bigIntString } from "@/schema/codecs";

export const rankParams = z.object({ id: z.coerce.number().int() });

const requirement = z.number().int().min(0);

export const rankRequirementsBody = z.object({
  actingDiscordId: bigIntString.optional(),
  clanPoints: requirement,
  diaryPoints: requirement,
  masterDiaries: requirement
});
