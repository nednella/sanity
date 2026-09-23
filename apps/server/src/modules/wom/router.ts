import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { notFound } from "@/schema/common";

import { womPlayerParams } from "./request";
import { syncPlayer } from "./service/sync-player";

/**
 * Wise Old Man refuses a player it updated in the last minute, one the hiscores don't return data
 * for, or one who opted out of being tracked. Its status code says which.
 */
const WOM_ERRORS = {
  400: "That RSN isn't on the hiscores",
  403: "Wise Old Man can't update this player",
  404: "Wise Old Man has no record of that RSN",
  429: "Updated less than a minute ago, try again shortly"
} as const;

const isWomError = (status: number | undefined): status is keyof typeof WOM_ERRORS =>
  status !== undefined && Object.hasOwn(WOM_ERRORS, status);

export const womRouter: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: "POST",
    url: "/wom/players/:username/sync",
    schema: {
      params: womPlayerParams,
      response: {
        204: z.void(),
        400: notFound,
        403: notFound,
        404: notFound,
        429: notFound
      }
    },
    handler: async (req, res) => {
      const { username } = req.params;
      try {
        const stored = await syncPlayer(username);
        if (!stored) return res.code(404).send({ message: `RSN ${username} is not tracked by Sanity` });
      } catch (error) {
        const { statusCode } = error as { statusCode?: number };
        if (!isWomError(statusCode)) throw error;

        return res.code(statusCode).send({ message: WOM_ERRORS[statusCode] });
      }

      return res.code(204).send();
    }
  });
};
