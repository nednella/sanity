import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { paginated, toPage } from "@/schema/common";

import { submissionListQuery } from "./request";
import { submission } from "./response";
import { getSubmissions } from "./service/get-submissions";

export const submissionsRouter: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: "GET",
    url: "/submissions",
    schema: {
      querystring: submissionListQuery,
      response: { 200: paginated(submission) }
    },
    handler: async (req) => {
      const { limit, offset } = req.query;
      const { items, total } = await getSubmissions(req.query);
      return { items, page: toPage({ limit, offset, total }) };
    }
  });
};
