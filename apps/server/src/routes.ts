import type { FastifyPluginAsync } from "fastify";

import { healthRouter } from "@/modules/health/router";
import { adminMembersRouter, membersRouter } from "@/modules/members/router";
import { adminPersonalBestsRouter, personalBestsRouter } from "@/modules/personal-bests/router";
import { adminPointsRouter } from "@/modules/points/router";
import { ranksRouter } from "@/modules/ranks/router";
import { adminSubmissionsRouter, submissionsRouter } from "@/modules/submissions/router";
import { womRouter } from "@/modules/wom/router";

export const routes: FastifyPluginAsync = async (app) => {
  app.register(adminMembersRouter);
  app.register(adminPersonalBestsRouter);
  app.register(adminPointsRouter);
  app.register(adminSubmissionsRouter);
  app.register(healthRouter);
  app.register(membersRouter);
  app.register(personalBestsRouter);
  app.register(ranksRouter);
  app.register(submissionsRouter);
  app.register(womRouter);
};
