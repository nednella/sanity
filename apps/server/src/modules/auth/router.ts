import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { errorResponse } from "@/schema/common";

import { createPluginKey } from "./service/create-plugin-key";

export const authPluginKeyRouter: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: "POST",
    url: "/auth/plugin-key",
    schema: {
      response: {
        201: z.object({ key: z.string() }),
        403: errorResponse
      }
    },
    handler: async (req, reply) => {
      const key = await createPluginKey(req.actor);
      return reply.code(201).send({ key });
    }
  });
};
