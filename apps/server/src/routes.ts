import type { FastifyPluginAsync } from "fastify";

import { healthRoutes } from "./modules/health/handler.js";

export const routes: FastifyPluginAsync = async (app) => {
  app.register(healthRoutes, { prefix: "/health" });
};
