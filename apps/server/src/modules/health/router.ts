import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { pingDatabase } from "./repository/ping-database";

export const healthRouter: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: "GET",
    url: "/health",
    schema: { response: { 200: z.object({ status: z.literal("ok") }) } },
    handler: async () => {
      await pingDatabase();
      return { status: "ok" as const };
    }
  });
};
