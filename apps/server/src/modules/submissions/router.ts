import { z } from "zod";

import { errorResponse, paginated, reviewBody, toPage } from "@/schema/common";
import { defineModule } from "@/utils/define-module";
import { defineRoute } from "@/utils/define-route";

import { createSubmissionBody, submissionListQuery, submissionParams } from "./request";
import { createdSubmission, submission } from "./response";
import { createSubmission } from "./service/create-submission";
import { getSubmissions } from "./service/get-submissions";
import { reviewSubmissionById } from "./service/review-submission-by-id";

export const submissionsModule = defineModule([
  defineRoute({
    method: "GET",
    url: "/submissions",
    config: {
      access: "public"
    },
    schema: {
      querystring: submissionListQuery,
      response: {
        200: paginated(submission)
      }
    },
    handler: async (req) => {
      const { limit, offset } = req.query;
      const { items, total } = await getSubmissions(req.query);
      return { items, page: toPage({ limit, offset, total }) };
    }
  }),

  defineRoute({
    method: "POST",
    url: "/submissions",
    config: {
      access: {
        role: "*",
        clients: ["bot"]
      }
    },
    schema: {
      body: createSubmissionBody,
      response: {
        201: createdSubmission
      }
    },
    handler: async (req, reply) => {
      const id = await createSubmission(req.body, req.auth);
      return reply.code(201).send({ id });
    }
  }),

  defineRoute({
    method: "POST",
    url: "/admin/submissions/:id/review",
    config: {
      access: {
        role: "admin",
        clients: ["bot"]
      }
    },
    schema: {
      params: submissionParams,
      body: reviewBody,
      response: {
        200: z.object({ status: reviewBody.shape.status }),
        404: errorResponse,
        409: errorResponse
      }
    },
    handler: async (req) => {
      await reviewSubmissionById(req.params.id, req.body, req.auth);
      return { status: req.body.status };
    }
  })
]);
