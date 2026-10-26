import { z } from "zod";

import { errorResponse, paginated, reviewBody, toPage } from "@/schema/common";
import { defineModule } from "@/utils/define-module";
import { defineRoute } from "@/utils/define-route";

import { listContent } from "./repository/list-content";
import { createPersonalBestBody, personalBestListQuery, personalBestParams, recordListQuery } from "./request";
import { createdPersonalBest, personalBestContent, rankedPersonalBest } from "./response";
import { createPersonalBest } from "./service/create-personal-best";
import { getPersonalBests } from "./service/get-personal-bests";
import { getRecords } from "./service/get-records";
import { reviewPersonalBestById } from "./service/review-personal-best-by-id";

export const personalBestsModule = defineModule([
  defineRoute({
    method: "GET",
    url: "/personal-bests",
    config: {
      access: "public"
    },
    schema: {
      querystring: personalBestListQuery,
      response: {
        200: paginated(rankedPersonalBest)
      }
    },
    handler: async (req) => {
      const { limit, offset } = req.query;
      const { items, total } = await getPersonalBests(req.query);
      return { items, page: toPage({ limit, offset, total }) };
    }
  }),

  defineRoute({
    method: "GET",
    url: "/personal-bests/content",
    config: {
      access: "public"
    },
    schema: {
      response: {
        200: z.array(personalBestContent)
      }
    },
    handler: async () => listContent()
  }),

  defineRoute({
    method: "GET",
    url: "/personal-bests/records",
    config: {
      access: "public"
    },
    schema: {
      querystring: recordListQuery,
      response: {
        200: z.array(rankedPersonalBest)
      }
    },
    handler: async (req) => getRecords(req.query)
  }),

  defineRoute({
    method: "POST",
    url: "/personal-bests",
    config: {
      access: {
        role: "*",
        clients: ["bot"]
      }
    },
    schema: {
      body: createPersonalBestBody,
      response: {
        201: createdPersonalBest
      }
    },
    handler: async (req, reply) => {
      const id = await createPersonalBest(req.body, req.auth);
      return reply.code(201).send({ id });
    }
  }),

  defineRoute({
    method: "POST",
    url: "/personal-bests/:id/review",
    config: {
      access: {
        role: "admin",
        clients: ["bot"]
      }
    },
    schema: {
      params: personalBestParams,
      body: reviewBody,
      response: {
        200: z.object({ status: reviewBody.shape.status }),
        404: errorResponse,
        409: errorResponse
      }
    },
    handler: async (req) => {
      await reviewPersonalBestById(req.params.id, req.body, req.auth);
      return { status: req.body.status };
    }
  })
]);
