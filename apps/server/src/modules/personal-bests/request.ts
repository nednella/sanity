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

const personalBestSort = z
  .enum(["content", "scale", "submittedAt", "time"])
  .register(z.globalRegistry, { id: "PersonalBestSort" });

export const personalBestSortFilters = z.object({
  sort: personalBestSort.default("submittedAt"),
  order: z.enum(["asc", "desc"]).default("desc")
});

export type PersonalBestSort = z.output<typeof personalBestSort>;

export const personalBestListQuery = z.object({
  ...pagination.shape,
  ...contentFilters.shape
});

export const recordListQuery = z.object({
  ...recordFilters.shape,
  ...contentFilters.shape
});
