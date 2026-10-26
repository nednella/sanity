import type { FastifyPluginAsync } from "fastify";

import { authModule } from "@/modules/auth/router";
import { discordModule } from "@/modules/discord/router";
import { healthModule } from "@/modules/health/router";
import { membersModule } from "@/modules/members/router";
import { personalBestsModule } from "@/modules/personal-bests/router";
import { pointsModule } from "@/modules/points/router";
import { ranksModule } from "@/modules/ranks/router";
import { speedrunDiaryModule } from "@/modules/speedrun-diary/router";
import { submissionsModule } from "@/modules/submissions/router";
import { womModule } from "@/modules/wom/router";

export const routes: FastifyPluginAsync = async (app) => {
  app.register(authModule);
  app.register(discordModule);
  app.register(healthModule);
  app.register(membersModule);
  app.register(personalBestsModule);
  app.register(pointsModule);
  app.register(ranksModule);
  app.register(speedrunDiaryModule);
  app.register(submissionsModule);
  app.register(womModule);
};
