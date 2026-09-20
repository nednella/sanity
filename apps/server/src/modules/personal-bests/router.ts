import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { personalBestListQuery, recordListQuery } from "./request";
import { personalBest, rankedPersonalBest } from "./response";
import { getRecentPersonalBests } from "./service/get-recent-personal-bests";
import { getRecords } from "./service/get-records";

export const personalBestsRouter: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: "GET",
    url: "/personal-bests",
    schema: {
      querystring: personalBestListQuery,
      response: { 200: z.array(personalBest) }
    },
    handler: async (req) => getRecentPersonalBests(req.query)
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
