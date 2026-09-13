import { z } from "zod";

import { memberRef } from "../../lib/zod.js";

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
  submittedAt: z.date().nullable(),
  submittedBy: memberRef,
  team: z.array(memberRef)
});

// Built rather than extended, so position sits next to the id in the response.
export const rankedPersonalBest = z.object({
  id: personalBest.shape.id,
  position: z.number(),
  ...personalBest.omit({ id: true }).shape
});

export const top = z.coerce.number().int().min(1).max(10);

export const contentFilters = z.object({
  contentId: z.coerce.number().int().positive().optional(),
  scale: z.coerce.number().int().positive().optional()
});
