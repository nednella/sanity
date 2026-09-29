import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { paginated, toPage } from "@/schema/common";

import { createSubmissionBody, submissionListQuery } from "./request";
import { submission } from "./response";
import { createSubmission } from "./service/create-submission";
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

  app.route({
    method: "POST",
    url: "/submissions",
    schema: {
      body: createSubmissionBody,
      response: { 201: z.object({ id: z.number() }) }
    },
    handler: async (req, reply) => {
      const id = await createSubmission(req.body);
      return reply.code(201).send({ id });
    }
  });
};
