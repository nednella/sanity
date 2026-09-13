import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { pagination } from "../../lib/zod.js";
import { contentFilters, personalBest, rankedPersonalBest, top } from "./schemas.js";
import { getRecentPersonalBests, getRecords } from "./service.js";

const recordFilters = z.object({
  top: top.default(1)
});

export const personalBestRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/",
    {
      schema: {
        querystring: z.object({ ...pagination.shape, ...contentFilters.shape }),
        response: { 200: z.array(personalBest) }
      }
    },
    async (req) => getRecentPersonalBests(req.query)
  );

  app.get(
    "/records",
    {
      schema: {
        querystring: z.object({ ...recordFilters.shape, ...contentFilters.shape }),
        response: { 200: z.array(rankedPersonalBest) }
      }
    },
    async (req) => getRecords(req.query)
  );
};
