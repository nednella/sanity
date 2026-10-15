import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { notFound } from "@/schema/common";

import { rankParams, rankRequirementsBody } from "./request";
import { rank } from "./response";
import { editRankRequirements } from "./service/edit-rank-requirements";
import { getRanks } from "./service/get-ranks";

export const ranksRouter: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: "GET",
    url: "/ranks",
    schema: { response: { 200: z.array(rank) } },
    handler: async () => getRanks()
  });
};

export const adminRanksRouter: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: "PUT",
    url: "/ranks/:id/requirements",
    schema: {
      params: rankParams,
      body: rankRequirementsBody,
      response: { 204: z.void(), 404: notFound }
    },
    handler: async (req, reply) => {
      const edited = await editRankRequirements(req.params.id, req.body);
      if (!edited) return reply.code(404).send({ message: "Rank not found." });

      return reply.code(204).send();
    }
  });
};
