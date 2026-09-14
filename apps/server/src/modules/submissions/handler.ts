import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { contract } from "@sanity/api";

import { getSubmissions } from "./service.js";

export const submissionRoutes: FastifyPluginAsyncZod = async (app) => {
  app.route({
    ...contract.routes.submissions.list,
    handler: async (req) => getSubmissions(req.query)
  });
};
