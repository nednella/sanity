import { z } from "zod";

import { contentFilters, personalBestSortFilters, top } from "@/modules/personal-bests/request";
import { submissionSortFilters } from "@/modules/submissions/request";
import { bigIntString, booleanString } from "@/schema/codecs";
import { pagination } from "@/schema/common";

export const memberParams = z.object({ id: bigIntString });

const memberFilters = z.object({
  active: booleanString.optional(),
  search: z.string().trim().max(50).optional()
});

const memberSort = z
  .enum([
    "clanPoints",
    "diaryPoints",
    "displayName",
    "joinedAt",
    "masterDiaries",
    "rank",
    "totalEhb",
    "totalEhp",
    "totalExp",
    "totalLevel"
  ])
  .register(z.globalRegistry, { id: "MemberSort" });

const memberSortFilters = z.object({
  sort: memberSort.default("clanPoints"),
  order: z.enum(["asc", "desc"]).default("desc")
});

export const memberPersonalBestsQuery = z.object({
  ...pagination.shape,
  top: top.optional(),
  ...contentFilters.shape,
  ...personalBestSortFilters.shape
});

export const memberSubmissionsQuery = z.object({
  ...pagination.shape,
  ...submissionSortFilters.shape
});

export const memberListQuery = z.object({
  ...pagination.shape,
  ...memberFilters.shape,
  ...memberSortFilters.shape
});

export type MemberListQuery = Partial<z.output<typeof memberListQuery>>;
export type MemberSort = z.output<typeof memberSort>;
