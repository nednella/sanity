import { z } from "zod";

import { contentFilters, personalBestSortFilters, top } from "@/modules/personal-bests/request";
import { submissionSortFilters } from "@/modules/submissions/request";
import { bigIntString, booleanString } from "@/schema/codecs";
import { pagination } from "@/schema/common";

export const memberParams = z.object({ id: bigIntString });

const rsn = z.string().trim().min(1).max(12);

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

export const memberCommandBody = z.object({
  actingDiscordId: bigIntString.optional(),
  taggedDiscordIds: z.array(bigIntString).min(1).max(50),
  note: z.string().trim().max(500).optional()
});

const trialist = z.object({
  altRsn: rsn.nullable().default(null),
  discordId: bigIntString,
  displayName: z.string().trim().min(1).max(32),
  mainRsn: rsn
});

export const changeRankBody = memberCommandBody.extend({ rankId: z.number().int() });

export const trialBody = z.object({
  actingDiscordId: bigIntString.optional(),
  trialists: z.array(trialist).min(1).max(50)
});

export const memberListQuery = z.object({
  ...pagination.shape,
  ...memberFilters.shape,
  ...memberSortFilters.shape
});

export const updateMemberBody = z
  .object({
    actingMemberId: bigIntString.optional(),
    altRsn: rsn.nullable(),
    birthday: z.iso.date().nullable(),
    mainRsn: rsn,
    nationality: z.string().trim().length(2).uppercase().nullable()
  })
  .partial();

export type MemberListQuery = Partial<z.output<typeof memberListQuery>>;
export type MemberSort = z.output<typeof memberSort>;
