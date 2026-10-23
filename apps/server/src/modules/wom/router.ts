import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { errorResponse } from "@/schema/common";

import { womPlayerParams } from "./request";
import { syncPlayer } from "./service/sync-player";

export const womRouter: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: "POST",
    url: "/wom/players/:username/sync",
    schema: {
      params: womPlayerParams,
      response: {
        204: z.void(),
        400: errorResponse,
        403: errorResponse,
        404: errorResponse,
        429: errorResponse
      }
    },
    handler: async (req, res) => {
      await syncPlayer(req.params.username);
      return res.code(204).send();
    }
  });
};
