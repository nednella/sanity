import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { awardPointsBody } from "./request";
import { awardManualPoints } from "./service/award-manual-points";

export const adminPointsRouter: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: "POST",
    url: "/points",
    schema: {
      body: awardPointsBody,
      response: { 201: z.object({ awarded: z.number() }) }
    },
    handler: async (req, reply) => {
      const awarded = await awardManualPoints(req.body);
      return reply.code(201).send({ awarded });
    }
  });
};
