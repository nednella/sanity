import type { FastifyPluginAsync } from "fastify";

import { healthRoutes } from "./modules/health/handler.js";
import { memberRoutes } from "./modules/members/handler.js";
import { personalBestRoutes } from "./modules/personal-bests/handler.js";
import { rankRoutes } from "./modules/ranks/handler.js";
import { submissionRoutes } from "./modules/submissions/handler.js";

export const routes: FastifyPluginAsync = async (app) => {
  app.register(healthRoutes, { prefix: "/health" });
  app.register(memberRoutes, { prefix: "/members" });
  app.register(personalBestRoutes, { prefix: "/personal-bests" });
  app.register(rankRoutes, { prefix: "/ranks" });
  app.register(submissionRoutes, { prefix: "/submissions" });
};
