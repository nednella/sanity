import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { contract } from "@sanity/api";

import { getRecentPersonalBests, getRecords } from "./service.js";

export const personalBestRoutes: FastifyPluginAsyncZod = async (app) => {
  app.route({
    ...contract.routes.personalBests.list,
    handler: async (req) => getRecentPersonalBests(req.query)
  });

  app.route({
    ...contract.routes.personalBests.listRecords,
    handler: async (req) => getRecords(req.query)
  });
};
