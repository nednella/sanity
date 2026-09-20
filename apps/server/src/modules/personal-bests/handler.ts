import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { personalBestListQuery, recordListQuery } from "./request.js";
import { personalBest, rankedPersonalBest } from "./response.js";
import { getRecentPersonalBests, getRecords } from "./service.js";

export const personalBestRoutes: FastifyPluginAsyncZod = async (app) => {
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
