import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { toRank } from "./mapper.js";
import { listRanks } from "./repo.js";
import { rank } from "./response.js";

export const rankRoutes: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: "GET",
    url: "/ranks",
    schema: { response: { 200: z.array(rank) } },
    handler: async () => {
      const rows = await listRanks();
      return rows.map((row) => toRank(row));
    }
  });
};
