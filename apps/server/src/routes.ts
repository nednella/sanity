import type { FastifyPluginAsync } from "fastify";

import { config } from "@config";

import { authPluginKeyRouter } from "@/modules/auth/router";
import { authenticate } from "@/modules/auth/service/authenticate";
import { adminDiscordRouter } from "@/modules/discord/router";
import { healthRouter } from "@/modules/health/router";
import { adminMembersRouter, authProfileRouter, membersRouter } from "@/modules/members/router";
import {
  adminPersonalBestsRouter,
  authPersonalBestsRouter,
  personalBestsRouter
} from "@/modules/personal-bests/router";
import { adminPointsRouter } from "@/modules/points/router";
import { ranksRouter } from "@/modules/ranks/router";
import { speedrunDiaryRouter } from "@/modules/speedrun-diary/router";
import { adminSubmissionsRouter, authSubmissionsRouter, submissionsRouter } from "@/modules/submissions/router";
import { womRouter } from "@/modules/wom/router";

const publicRoutes: FastifyPluginAsync = async (app) => {
  app.register(healthRouter);
  app.register(membersRouter);
  app.register(personalBestsRouter);
  app.register(ranksRouter);
  app.register(speedrunDiaryRouter);
  app.register(submissionsRouter);
  app.register(womRouter);
};

const authRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("onRequest", authenticate);

  app.register(authPersonalBestsRouter);
  app.register(authPluginKeyRouter);
  app.register(authProfileRouter);
  app.register(authSubmissionsRouter);
};

const adminRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("onRequest", authenticate);

  // hide admin routes from production `/docs` endpoint
  app.addHook("onRoute", (route) => {
    route.schema = { ...route.schema, hide: config.isProduction };
  });

  app.register(adminDiscordRouter);
  app.register(adminMembersRouter);
  app.register(adminPersonalBestsRouter);
  app.register(adminPointsRouter);
  app.register(adminSubmissionsRouter);
};

export const routes: FastifyPluginAsync = async (app) => {
  app.register(publicRoutes);
  app.register(authRoutes);
  app.register(adminRoutes, { prefix: "/admin" });
};
