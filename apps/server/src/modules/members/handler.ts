import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { bigIntString, booleanString, notFound, pagination } from "../../lib/zod.js";
import { getMemberProfile, getMembers } from "./service.js";

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
  joinedAt: z.date().nullable(),
  leftAt: z.date().nullable(),
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
  totalLevel: z.number().nullable(),
  totalExp: z.number(),
  totalEhp: z.number(),
  totalEhb: z.number(),
  updatedAt: z.date().nullable()
});

const member = z.object({
  id: bigIntString,
  displayName: z.string(),
  nationality: z.string(),
  discord,
  rsn,
  membership,
  diary,
  wom: womPlayer.nullable()
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

const skill = z.object({
  skill: z.string(),
  experience: z.number(),
  level: z.number(),
  rank: z.number().nullable(),
  ehp: z.number()
});

const boss = z.object({
  boss: z.string(),
  kills: z.number(),
  rank: z.number().nullable(),
  ehb: z.number()
});

const activity = z.object({
  activity: z.string(),
  score: z.number(),
  rank: z.number().nullable()
});

const snapshot = z.object({
  createdAt: z.date(),
  skills: z.array(skill),
  bosses: z.array(boss),
  activities: z.array(activity)
});

// Built rather than extended, because extend() would put progression after wom in the response.
const memberProfile = z.object({
  ...member.omit({ wom: true }).shape,
  progression,
  wom: womPlayer.extend({ latestSnapshot: snapshot.nullable() }).nullable()
});

const memberFilters = z.object({
  active: booleanString.default(true)
});

export const memberRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/",
    {
      schema: {
        querystring: z.object({ ...pagination.shape, ...memberFilters.shape }),
        response: { 200: z.array(member) }
      }
    },
    async (req) => getMembers(req.query)
  );

  app.get(
    "/:id",
    {
      schema: {
        params: z.object({ id: bigIntString }),
        response: { 200: memberProfile, 404: notFound }
      }
    },
    async (req, res) => {
      const profile = await getMemberProfile(req.params.id);
      return profile ?? res.code(404).send({ message: "member not found" });
    }
  );
};
