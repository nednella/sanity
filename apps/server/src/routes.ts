import type { FastifyPluginAsync } from "fastify";

import { healthRoutes } from "./modules/health/handler";
import { memberRoutes } from "./modules/members/handler";
import { personalBestRoutes } from "./modules/personal-bests/handler";
import { rankRoutes } from "./modules/ranks/handler";
import { submissionRoutes } from "./modules/submissions/handler";

export const routes: FastifyPluginAsync = async (app) => {
  app.register(healthRoutes);
  app.register(memberRoutes);
  app.register(personalBestRoutes);
  app.register(rankRoutes);
  app.register(submissionRoutes);
};
