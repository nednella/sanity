import type { FastifyPluginAsync } from "fastify";

import { healthRoutes } from "./modules/health/handler.js";
import { memberRoutes } from "./modules/members/handler.js";
import { rankRoutes } from "./modules/ranks/handler.js";

export const routes: FastifyPluginAsync = async (app) => {
  app.register(healthRoutes, { prefix: "/health" });
  app.register(memberRoutes, { prefix: "/members" });
  app.register(rankRoutes, { prefix: "/ranks" });
};
