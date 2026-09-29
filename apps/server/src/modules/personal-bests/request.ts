import { z } from "zod";

import { bigIntString, booleanString } from "@/schema/codecs";
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
  top: top.optional(),
  ...contentFilters.shape,
  ...personalBestSortFilters.shape
});

export const recordListQuery = z.object({
  ...recordFilters.shape,
  ...contentFilters.shape
});

export const createPersonalBestBody = z
  .object({
    submittedByMemberId: bigIntString,
    contentId: z.number().int().positive(),
    scale: z.number().int().min(1).max(10),
    timeSeconds: z.number().positive().max(86_400),
    imageUrl: z.url().nullable().default(null),
    participants: z.array(bigIntString).min(1)
  })
  // The team is who the run is credited to, so it cannot hold more people than the run had.
  .refine(({ participants, scale }) => participants.length <= scale, {
    message: "More members than the team size allows",
    path: ["participants"]
  });
