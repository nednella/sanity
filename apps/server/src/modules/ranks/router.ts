import { z } from "zod";

import { defineModule } from "@/utils/define-module";
import { defineRoute } from "@/utils/define-route";

import { rank } from "./response";
import { getRanks } from "./service/get-ranks";

export const ranksModule = defineModule([
  defineRoute({
    method: "GET",
    url: "/ranks",
    config: {
      access: "public"
    },
    schema: {
      response: {
        200: z.array(rank)
      }
    },
    handler: async () => getRanks()
  })
]);
