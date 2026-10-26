import { z } from "zod";

import { errorResponse } from "@/schema/common";
import { defineModule } from "@/utils/define-module";
import { defineRoute } from "@/utils/define-route";

import { womPlayerParams } from "./request";
import { syncPlayer } from "./service/sync-player";

export const womModule = defineModule([
  defineRoute({
    method: "POST",
    url: "/wom/players/:username/sync",
    config: {
      access: "public"
    },
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
  })
]);
