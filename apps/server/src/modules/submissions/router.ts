import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { submissionListQuery } from "./request";
import { submission } from "./response";
import { getSubmissions } from "./service/get-submissions";

export const submissionsRouter: FastifyPluginAsyncZod = async (app) => {
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
