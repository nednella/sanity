import { z } from "zod";

import type { MemberRole } from "@db/enums";

import { contentFilters, personalBestSortFilters, top } from "@/modules/personal-bests/request";
import { QUIT_RANK_ID, RETIRED_RANK_ID } from "@/modules/ranks/constants";
import { listedStatus, submissionSortFilters } from "@/modules/submissions/request";
import { bigIntString, booleanString } from "@/schema/codecs";
import { pagination } from "@/schema/common";

export const memberParams = z.object({ id: bigIntString });

export const memberDiscordParams = z.object({ discordId: bigIntString });

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
  status: listedStatus.optional(),
  ...submissionSortFilters.shape
});

const memberRef = z.union([z.object({ memberId: bigIntString }), z.object({ discordId: bigIntString })]);

export const memberBatchBody = z.object({
  members: z.array(memberRef).min(1).max(50),
  note: z.string().trim().max(500).optional()
});

const trialist = z.object({
  altRsn: rsn.nullable().default(null),
  discordId: bigIntString,
  displayName: z.string().trim().min(1).max(32),
  mainRsn: rsn
});

export const giveAdminBody = memberBatchBody.extend({ role: z.enum(["admin"]) });

export const giveRoleBody = memberBatchBody.extend({ role: z.enum(["reviewer"]) });

export const changeRankBody = memberBatchBody.extend({
  rankId: z
    .number()
    .int()
    .refine((rankId) => rankId !== QUIT_RANK_ID && rankId !== RETIRED_RANK_ID, "Use quit or retire for that rank")
});

export const changePluginAccessBody = memberBatchBody.extend({ revoked: z.boolean() });

export const trialBody = z.object({ trialists: z.array(trialist).min(1).max(50) });

export const memberListQuery = z.object({
  ...pagination.shape,
  ...memberFilters.shape,
  ...memberSortFilters.shape
});

export const updateMemberBody = z
  .object({
    altRsn: rsn.nullable(),
    birthday: z.iso.date().nullable(),
    mainRsn: rsn,
    nationality: z.string().trim().length(2).uppercase().nullable()
  })
  .partial();

export type MemberBatch = z.output<typeof memberBatchBody>;
export type MemberRef = z.output<typeof memberRef>;
export type MemberListQuery = Partial<z.output<typeof memberListQuery>>;
export type MemberSort = z.output<typeof memberSort>;
export type NewMember = z.output<typeof trialist>;
export type PluginAccessChange = z.output<typeof changePluginAccessBody>;
export type RankChange = z.output<typeof changeRankBody>;
export type RoleChange = MemberBatch & { role: MemberRole | null };
export type TrialistBatch = z.output<typeof trialBody>;
