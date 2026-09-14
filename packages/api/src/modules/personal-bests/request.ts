import { z } from "zod";

export const top = z.coerce.number().int().min(1).max(10);

export const contentFilters = z.object({
  contentId: z.coerce.number().int().positive().optional(),
  scale: z.coerce.number().int().positive().optional()
});

export const recordFilters = z.object({ top: top.default(1) });
