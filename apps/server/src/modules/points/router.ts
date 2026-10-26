import { defineModule } from "@/utils/define-module";
import { defineRoute } from "@/utils/define-route";

import { awardPointsBody } from "./request";
import { awardedPoints } from "./response";
import { awardManualPoints } from "./service/award-manual-points";

export const pointsModule = defineModule([
  defineRoute({
    method: "POST",
    url: "/points",
    config: {
      access: {
        role: "admin",
        clients: ["bot"]
      }
    },
    schema: {
      body: awardPointsBody,
      response: {
        201: awardedPoints
      }
    },
    handler: async (req, reply) => {
      const awarded = await awardManualPoints(req.body, req.auth);
      return reply.code(201).send({ awarded });
    }
  })
]);
