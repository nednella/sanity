import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { notFound, paginated, toPage } from "../../schema/common";
import { rankedPersonalBest } from "../personal-bests/response";
import { getMemberPersonalBests } from "../personal-bests/service";
import { memberListQuery, memberParams, memberPersonalBestsQuery } from "./request";
import { member, memberProfile } from "./response";
import { getMemberProfile, getMembers } from "./service";

export const memberRoutes: FastifyPluginAsyncZod = async (app) => {
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
