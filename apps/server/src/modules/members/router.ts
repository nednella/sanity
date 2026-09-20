import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { rankedPersonalBest } from "@/modules/personal-bests/response";
import { getMemberPersonalBests } from "@/modules/personal-bests/service/get-member-personal-bests";
import { notFound, paginated, toPage } from "@/schema/common";

import { memberListQuery, memberParams, memberPersonalBestsQuery } from "./request";
import { member, memberProfile } from "./response";
import { getMemberProfile } from "./service/get-member-profile";
import { getMembers } from "./service/get-members";

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
    url: "/members/:id/personal-bests",
    schema: {
      params: memberParams,
      querystring: memberPersonalBestsQuery,
      response: { 200: z.array(rankedPersonalBest) }
    },
    handler: async (req) => getMemberPersonalBests(req.params.id, req.query)
  });
};
