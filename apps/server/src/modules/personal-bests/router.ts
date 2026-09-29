import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { paginated, reviewBody, toPage } from "@/schema/common";

import { listContent } from "./repository/list-content";
import { createPersonalBestBody, personalBestListQuery, personalBestParams, recordListQuery } from "./request";
import { personalBestContent, rankedPersonalBest } from "./response";
import { createPersonalBest } from "./service/create-personal-best";
import { getPersonalBests } from "./service/get-personal-bests";
import { getRecords } from "./service/get-records";
import { reviewPersonalBestById } from "./service/review-personal-best-by-id";

export const personalBestsRouter: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: "GET",
    url: "/personal-bests",
    schema: {
      querystring: personalBestListQuery,
      response: { 200: paginated(rankedPersonalBest) }
    },
    handler: async (req) => {
      const { limit, offset } = req.query;
      const { items, total } = await getPersonalBests(req.query);
      return { items, page: toPage({ limit, offset, total }) };
    }
  });

  app.route({
    method: "GET",
    url: "/personal-bests/content",
    schema: { response: { 200: z.array(personalBestContent) } },
    handler: async () => listContent()
  });

  app.route({
    method: "GET",
    url: "/personal-bests/records",
    schema: {
      querystring: recordListQuery,
      response: { 200: z.array(rankedPersonalBest) }
    },
    handler: async (req) => getRecords(req.query)
  });

  // Who submits and who reviews arrive in the body until there is a session to read them from.
  app.route({
    method: "POST",
    url: "/personal-bests",
    schema: {
      body: createPersonalBestBody,
      response: { 201: z.object({ id: z.number() }) }
    },
    handler: async (req, reply) => {
      const id = await createPersonalBest(req.body);
      return reply.code(201).send({ id });
    }
  });

  app.route({
    method: "POST",
    url: "/personal-bests/:id/review",
    schema: {
      params: personalBestParams,
      body: reviewBody,
      response: {
        200: z.object({ status: reviewBody.shape.status }),
        409: z.object({ message: z.string() })
      }
    },
    handler: async (req, reply) => {
      const result = await reviewPersonalBestById(req.params.id, req.body);
      if (result === "not-awaiting-review") {
        return reply.code(409).send({ message: "This personal best is not awaiting review." });
      }

      return { status: req.body.status };
    }
  });
};
