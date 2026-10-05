import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { health } from "./response";
import { checkHealth } from "./service/check-health";

export const healthRouter: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: "GET",
    url: "/health",
    schema: { response: { 200: health, 503: health } },
    handler: async (_, reply) => {
      const result = await checkHealth();
      return reply.code(result.status === "ok" ? 200 : 503).send(result);
    }
  });
};
