import { z } from "zod";

import { bigIntString, booleanString } from "../../schema/codecs";
import { pagination } from "../../schema/common";
import { contentFilters, top } from "../personal-bests/request";

export const memberParams = z.object({ id: bigIntString });

export const memberFilters = z.object({ active: booleanString.optional() });

export const memberSort = z.enum([
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
]);

export const memberSortFilters = z.object({
  sort: memberSort.default("clanPoints"),
  order: z.enum(["asc", "desc"]).default("desc")
});

export const memberPersonalBestsQuery = z.object({
  ...pagination.shape,
  top: top.optional(),
  ...contentFilters.shape
});

export const memberListQuery = z.object({
  ...pagination.shape,
  ...memberFilters.shape,
  ...memberSortFilters.shape
});

export type MemberListQuery = Partial<z.output<typeof memberListQuery>>;
export type MemberSort = z.output<typeof memberSort>;
