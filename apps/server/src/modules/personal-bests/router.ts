import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { paginated, toPage } from "@/schema/common";

import { listContent } from "./repository/list-content";
import { personalBestListQuery, recordListQuery } from "./request";
import { personalBestContent, rankedPersonalBest } from "./response";
import { getPersonalBests } from "./service/get-personal-bests";
import { getRecords } from "./service/get-records";

export const personalBestsRouter: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: "GET",
    url: "/personal-bests",
    schema: {
      querystring: personalBestListQuery,
      response: { 200: paginated(rankedPersonalBest) }
    },
    handler: async (req) => {
      const { limit, offset } = req.query;
      const { items, total } = await getPersonalBests(req.query);
      return { items, page: toPage({ limit, offset, total }) };
    }
  });

  app.route({
    method: "GET",
    url: "/personal-bests/content",
    schema: { response: { 200: z.array(personalBestContent) } },
    handler: async () => listContent()
  });

  app.route({
    method: "GET",
    url: "/personal-bests/records",
    schema: {
      querystring: recordListQuery,
      response: { 200: z.array(rankedPersonalBest) }
    },
    handler: async (req) => getRecords(req.query)
  });
};
