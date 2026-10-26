import { defineModule } from "@/utils/define-module";
import { defineRoute } from "@/utils/define-route";

import { health } from "./response";
import { checkHealth } from "./service/check-health";

export const healthModule = defineModule([
  defineRoute({
    method: "GET",
    url: "/health",
    config: {
      access: "public"
    },
    schema: {
      response: {
        200: health,
        503: health
      }
    },
    handler: async (_, reply) => {
      const result = await checkHealth();
      return reply.code(result.status === "ok" ? 200 : 503).send(result);
    }
  })
]);
