import { z } from "zod";

import { bigIntString } from "@/schema/codecs";

export const diaryTimeParams = z.object({
  contentId: z.coerce.number().int().positive(),
  scale: z.coerce.number().int().min(1).max(10),
  tierId: z.coerce.number().int().positive()
});

export const diaryTimeBody = z.object({
  actingDiscordId: bigIntString.optional(),
  timeSeconds: z.number().positive().max(86_400)
});
