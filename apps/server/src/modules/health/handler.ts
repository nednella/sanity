import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { contract } from "@sanity/api";

import { pingDatabase } from "./repo.js";

export const healthRoutes: FastifyPluginAsyncZod = async (app) => {
  app.route({
    ...contract.routes.health.get,
    handler: async () => {
      await pingDatabase();
      return { status: "ok" as const };
    }
  });
};
