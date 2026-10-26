import { errorResponse } from "@/schema/common";
import { defineModule } from "@/utils/define-module";
import { defineRoute } from "@/utils/define-route";

import { pluginKey } from "./response";
import { createPluginKey } from "./service/create-plugin-key";

export const authModule = defineModule([
  defineRoute({
    method: "POST",
    url: "/auth/plugin-key",
    config: {
      access: {
        role: "*",
        clients: ["bot"]
      }
    },
    schema: {
      response: {
        201: pluginKey,
        403: errorResponse
      }
    },
    handler: async (req, reply) => {
      const key = await createPluginKey(req.auth);
      return reply.code(201).send({ key });
    }
  })
]);
