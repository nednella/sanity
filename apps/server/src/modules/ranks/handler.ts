import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { bigIntString } from "../../lib/zod.js";
import { toRank } from "./mapper.js";
import { listRanks } from "./repo.js";

const rank = z.object({
  id: z.number(),
  name: z.string(),
  iconUrl: z.string().nullable(),
  discordRoleId: bigIntString.nullable(),
  requirements: z.object({
    clanPoints: z.number(),
    diaryPoints: z.number(),
    masterDiaries: z.number(),
    maintenancePoints: z.number()
  })
});

export const rankRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/",
    {
      schema: {
        response: { 200: z.array(rank) }
      }
    },
    async () => {
      const rows = await listRanks();
      return rows.map((row) => toRank(row));
    }
  );
};
