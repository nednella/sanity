import { z } from "zod";

import { route } from "../../route.js";

export const healthRoutes = {
  get: route({
    method: "GET",
    url: "/health",
    schema: { response: { 200: z.object({ status: z.literal("ok") }) } }
  })
};
