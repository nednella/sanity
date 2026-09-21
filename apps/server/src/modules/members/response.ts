import { z } from "zod";

import { bigIntString, isoDate } from "@/schema/codecs";

const rank = z.object({
  id: z.number(),
  name: z.string(),
  iconUrl: z.string().nullable()
});

const discord = z.object({
  id: bigIntString,
  avatarUrl: z.string().nullable()
});

const rsn = z.object({
  main: z.string().nullable(),
  alt: z.string().nullable()
});

const membership = z.object({
  active: z.boolean(),
  joinedAt: isoDate.nullable(),
  leftAt: isoDate.nullable(),
  rank,
  points: z.number()
});

const diaryTier = z.object({
  id: z.number(),
  name: z.string()
});

const diary = z.object({
  points: z.number(),
  masterDiaries: z.number(),
  claimedTier: diaryTier.nullable()
});

const womPlayer = z.object({
  playerId: z.number(),
  username: z.string(),
  displayName: z.string(),
  type: z.string(),
  build: z.string(),
  status: z.string().nullable(),
  totalLevel: z.number().nullable(),
  totalExp: z.number(),
  totalEhp: z.number(),
  totalEhb: z.number(),
  timeToMax: z.number().nullable(),
  timeTo200m: z.number().nullable(),
  updatedAt: isoDate.nullable(),
  lastChangedAt: isoDate.nullable()
});

const nextRank = rank.extend({
  requirements: z.object({
    clanPoints: z.number(),
    diaryPoints: z.number(),
    masterDiaries: z.number()
  })
});

const progression = z.object({
  eligibleRank: rank.nullable(),
  nextRank: z.object({
    points: nextRank.nullable(),
    diary: nextRank.nullable()
  })
});

const computed = z
  .object({
    metric: z.string(),
    value: z.number(),
    rank: z.number().nullable()
  })
  .register(z.globalRegistry, { id: "Computed" });

const skill = z
  .object({
    skill: z.string(),
    experience: z.number(),
    level: z.number(),
    rank: z.number().nullable(),
    ehp: z.number()
  })
  .register(z.globalRegistry, { id: "Skill" });

const boss = z
  .object({
    boss: z.string(),
    kills: z.number(),
    rank: z.number().nullable(),
    ehb: z.number()
  })
  .register(z.globalRegistry, { id: "Boss" });

const activity = z
  .object({
    activity: z.string(),
    score: z.number(),
    rank: z.number().nullable()
  })
  .register(z.globalRegistry, { id: "Activity" });

const snapshot = z
  .object({
    createdAt: isoDate,
    computed: z.array(computed),
    skills: z.array(skill),
    bosses: z.array(boss),
    activities: z.array(activity)
  })
  .register(z.globalRegistry, { id: "Snapshot" });

export const member = z
  .object({
    id: bigIntString,
    displayName: z.string(),
    nationality: z.string(),
    discord,
    rsn,
    membership,
    diary,
    wom: womPlayer.nullable()
  })
  .register(z.globalRegistry, { id: "Member" });

// Built rather than extended, because extend() would put progression after wom in the response.
export const memberProfile = z
  .object({
    ...member.omit({ wom: true }).shape,
    progression,
    wom: womPlayer.extend({ latestSnapshot: snapshot.nullable() }).nullable()
  })
  .register(z.globalRegistry, { id: "MemberProfile" });

export type Activity = z.output<typeof activity>;
export type Boss = z.output<typeof boss>;
export type Member = z.output<typeof member>;
export type MemberProfile = z.output<typeof memberProfile>;
export type Skill = z.output<typeof skill>;
