import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { diary } from "./response";
import { getDiaries } from "./service/get-diaries";

export const speedrunDiaryRouter: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: "GET",
    url: "/speedrun-diary",
    schema: { response: { 200: z.array(diary) } },
    handler: async () => getDiaries()
  });
};
