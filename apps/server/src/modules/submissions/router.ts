import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { paginated, reviewBody, toPage } from "@/schema/common";

import { createSubmissionBody, submissionListQuery, submissionParams } from "./request";
import { submission } from "./response";
import { createSubmission } from "./service/create-submission";
import { getSubmissions } from "./service/get-submissions";
import { reviewSubmissionById } from "./service/review-submission-by-id";

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

  app.route({
    method: "POST",
    url: "/submissions/:id/review",
    schema: {
      params: submissionParams,
      body: reviewBody,
      response: {
        200: z.object({ status: reviewBody.shape.status }),
        409: z.object({ message: z.string() })
      }
    },
    handler: async (req, reply) => {
      const result = await reviewSubmissionById(req.params.id, req.body);
      if (result === "not-awaiting-review") {
        return reply.code(409).send({ message: "This submission is not awaiting review." });
      }

      return { status: req.body.status };
    }
  });
};
