import type { FastifyPluginAsync } from "fastify";

import { config } from "@config";

import { authenticate } from "@/modules/auth/hooks/authenticate";
import { authModule } from "@/modules/auth/router";
import { discordModule } from "@/modules/discord/router";
import { healthModule } from "@/modules/health/router";
import { membersModule } from "@/modules/members/router";
import { personalBestsModule } from "@/modules/personal-bests/router";
import { adminPointsRouter } from "@/modules/points/router";
import { ranksRouter } from "@/modules/ranks/router";
import { speedrunDiaryRouter } from "@/modules/speedrun-diary/router";
import { adminSubmissionsRouter, authSubmissionsRouter, submissionsRouter } from "@/modules/submissions/router";
import { womRouter } from "@/modules/wom/router";

const publicRoutes: FastifyPluginAsync = async (app) => {
  app.register(healthModule);
  app.register(ranksRouter);
  app.register(speedrunDiaryRouter);
  app.register(submissionsRouter);
  app.register(womRouter);
};

const authRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("onRequest", authenticate);

  app.register(authModule);
  app.register(authSubmissionsRouter);
};

const adminRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("onRequest", authenticate);

  // hide admin routes from production `/docs` endpoint
  app.addHook("onRoute", (route) => {
    route.schema = { ...route.schema, hide: config.isProduction };
  });

  app.register(discordModule);
  app.register(adminPointsRouter);
  app.register(adminSubmissionsRouter);
};

export const routes: FastifyPluginAsync = async (app) => {
  app.register(publicRoutes);
  app.register(authRoutes);
  app.register(adminRoutes, { prefix: "/admin" });
  app.register(membersModule);
  app.register(personalBestsModule);
};
