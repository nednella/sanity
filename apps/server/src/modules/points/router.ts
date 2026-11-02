import { errorResponse } from "@/schema/common";
import { defineModule } from "@/utils/define-module";
import { defineRoute } from "@/utils/define-route";

import { addMultipliersBody, awardPointsBody } from "./request";
import { addedMultipliers, awardedPoints } from "./response";
import { addMultipliers } from "./service/add-multipliers";
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
  }),

  defineRoute({
    method: "POST",
    url: "/points/multipliers",
    config: {
      access: {
        role: "admin",
        clients: ["bot"]
      }
    },
    schema: {
      body: addMultipliersBody,
      response: {
        201: addedMultipliers,
        404: errorResponse
      }
    },
    handler: async (req, reply) => {
      const multipliers = await addMultipliers(req.body, req.auth);
      return reply.code(201).send({ multipliers });
    }
  })
]);
