import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { rank } from "./response";
import { getRanks } from "./service/get-ranks";

export const ranksRouter: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: "GET",
    url: "/ranks",
    schema: { response: { 200: z.array(rank) } },
    handler: async () => getRanks()
  });
};
