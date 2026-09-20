import { z } from "zod";

import { isoDate } from "@/schema/codecs";
import { memberRef } from "@/schema/common";

const content = z.object({
  id: z.number(),
  name: z.string(),
  imageUrl: z.string().nullable()
});

export const personalBest = z.object({
  id: z.number(),
  content,
  scale: z.number(),
  timeSeconds: z.number(),
  imageUrl: z.string().nullable(),
  submittedAt: isoDate.nullable(),
  submittedBy: memberRef,
  team: z.array(memberRef)
});

// Built rather than extended, so position sits next to the id in the response.
export const rankedPersonalBest = z.object({
  id: personalBest.shape.id,
  position: z.number(),
  ...personalBest.omit({ id: true }).shape
});
