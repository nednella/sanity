import type { FastifyPluginAsync } from "fastify";

import { healthRoutes } from "./modules/health/handler.js";
import { memberRoutes } from "./modules/members/handler.js";
import { personalBestRoutes } from "./modules/personal-bests/handler.js";
import { rankRoutes } from "./modules/ranks/handler.js";
import { submissionRoutes } from "./modules/submissions/handler.js";

export const routes: FastifyPluginAsync = async (app) => {
  app.register(healthRoutes);
  app.register(memberRoutes);
  app.register(personalBestRoutes);
  app.register(rankRoutes);
  app.register(submissionRoutes);
};
