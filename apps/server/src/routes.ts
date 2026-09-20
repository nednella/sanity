import type { FastifyPluginAsync } from "fastify";

import { healthRouter } from "@/modules/health/router";
import { membersRouter } from "@/modules/members/router";
import { personalBestsRouter } from "@/modules/personal-bests/router";
import { ranksRouter } from "@/modules/ranks/router";
import { submissionsRouter } from "@/modules/submissions/router";

export const routes: FastifyPluginAsync = async (app) => {
  app.register(healthRouter);
  app.register(membersRouter);
  app.register(personalBestsRouter);
  app.register(ranksRouter);
  app.register(submissionsRouter);
};
