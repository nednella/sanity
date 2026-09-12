import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { pingDatabase } from "./repo.js";

export const healthRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/",
    {
      schema: {
        response: { 200: z.object({ status: z.literal("ok") }) }
      }
    },
    async () => {
      await pingDatabase();
      return { status: "ok" as const };
    }
  );
};
