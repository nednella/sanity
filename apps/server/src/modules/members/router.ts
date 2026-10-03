import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { rankedPersonalBest } from "@/modules/personal-bests/response";
import { getPersonalBests } from "@/modules/personal-bests/service/get-personal-bests";
import { memberDiary } from "@/modules/speedrun-diary/response";
import { getMemberDiaries } from "@/modules/speedrun-diary/service/get-member-diaries";
import { submission } from "@/modules/submissions/response";
import { getSubmissions } from "@/modules/submissions/service/get-submissions";
import { notFound, paginated, toPage } from "@/schema/common";

import {
  memberCommandBody,
  memberListQuery,
  memberParams,
  memberPersonalBestsQuery,
  memberSubmissionsQuery,
  trialBody
} from "./request";
import { commandOutcomes, member, memberProfile, trialOutcomes } from "./response";
import { getMemberProfile } from "./service/get-member-profile";
import { getMembers } from "./service/get-members";
import { passTrial } from "./service/pass-trial";
import { retireMembers } from "./service/retire-members";
import { trialMembers } from "./service/trial-members";

export const membersRouter: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: "GET",
    url: "/members",
    schema: {
      querystring: memberListQuery,
      response: { 200: paginated(member) }
    },
    handler: async (req) => {
      const { limit, offset } = req.query;
      const { items, total } = await getMembers(req.query);
      return { items, page: toPage({ limit, offset, total }) };
    }
  });

  app.route({
    method: "GET",
    url: "/members/:id",
    schema: {
      params: memberParams,
      response: {
        200: memberProfile,
        404: notFound
      }
    },
    handler: async (req, res) => {
      const profile = await getMemberProfile(req.params.id);
      return profile ?? res.code(404).send({ message: "member not found" });
    }
  });

  app.route({
    method: "GET",
    url: "/members/:id/diary",
    schema: {
      params: memberParams,
      response: { 200: z.array(memberDiary) }
    },
    handler: async (req) => getMemberDiaries(req.params.id)
  });

  app.route({
    method: "GET",
    url: "/members/:id/personal-bests",
    schema: {
      params: memberParams,
      querystring: memberPersonalBestsQuery,
      response: { 200: paginated(rankedPersonalBest) }
    },
    handler: async (req) => {
      const { limit, offset } = req.query;
      const { items, total } = await getPersonalBests({ ...req.query, memberId: req.params.id });
      return { items, page: toPage({ limit, offset, total }) };
    }
  });

  app.route({
    method: "GET",
    url: "/members/:id/submissions",
    schema: {
      params: memberParams,
      querystring: memberSubmissionsQuery,
      response: { 200: paginated(submission) }
    },
    handler: async (req) => {
      const { limit, offset } = req.query;
      const { items, total } = await getSubmissions({ ...req.query, memberId: req.params.id });
      return { items, page: toPage({ limit, offset, total }) };
    }
  });
};

export const adminMembersRouter: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: "POST",
    url: "/members/pass-trial",
    schema: { body: memberCommandBody, response: { 200: commandOutcomes } },
    handler: async (req) => ({ results: await passTrial(req.body) })
  });

  app.route({
    method: "POST",
    url: "/members/retire",
    schema: { body: memberCommandBody, response: { 200: commandOutcomes } },
    handler: async (req) => ({ results: await retireMembers(req.body) })
  });

  app.route({
    method: "POST",
    url: "/members/trial",
    schema: { body: trialBody, response: { 200: trialOutcomes } },
    handler: async (req) => ({ results: await trialMembers(req.body) })
  });
};
