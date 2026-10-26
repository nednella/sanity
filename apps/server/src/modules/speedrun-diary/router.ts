import { z } from "zod";

import { defineModule } from "@/utils/define-module";
import { defineRoute } from "@/utils/define-route";

import { diary } from "./response";
import { getDiaries } from "./service/get-diaries";

export const speedrunDiaryModule = defineModule([
  defineRoute({
    method: "GET",
    url: "/speedrun-diary",
    config: {
      access: "public"
    },
    schema: {
      response: {
        200: z.array(diary)
      }
    },
    handler: async () => getDiaries()
  })
]);
