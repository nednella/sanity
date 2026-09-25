import { z } from "zod";

import { booleanString } from "@/schema/codecs";
import { pagination } from "@/schema/common";

export const top = z.coerce.number().int().min(1).max(10);

export const contentFilters = z.object({
  contentId: z.coerce.number().int().positive().optional(),
  diary: booleanString.optional(),
  scale: z.coerce.number().int().positive().optional()
});

const recordFilters = z.object({ top: top.default(1) });

export const personalBestListQuery = z.object({
  ...pagination.shape,
  ...contentFilters.shape
});

export const recordListQuery = z.object({
  ...recordFilters.shape,
  ...contentFilters.shape
});
