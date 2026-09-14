import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { contract } from "@sanity/api";

import { toRank } from "./mapper.js";
import { listRanks } from "./repo.js";

export const rankRoutes: FastifyPluginAsyncZod = async (app) => {
  app.route({
    ...contract.routes.ranks.list,
    handler: async () => {
      const rows = await listRanks();
      return rows.map((row) => toRank(row));
    }
  });
};
