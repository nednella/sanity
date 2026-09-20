import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { submissionListQuery } from "./request.js";
import { submission } from "./response.js";
import { getSubmissions } from "./service.js";

export const submissionRoutes: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: "GET",
    url: "/submissions",
    schema: {
      querystring: submissionListQuery,
      response: { 200: z.array(submission) }
    },
    handler: async (req) => getSubmissions(req.query)
  });
};
