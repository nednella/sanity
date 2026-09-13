import type { FastifyPluginAsync } from "fastify";

import { healthRoutes } from "./modules/health/handler.js";
import { rankRoutes } from "./modules/ranks/handler.js";

export const routes: FastifyPluginAsync = async (app) => {
  app.register(healthRoutes, { prefix: "/health" });
  app.register(rankRoutes, { prefix: "/ranks" });
};
