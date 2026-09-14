import { z } from "zod";

import { route } from "../../route.js";
import { rank } from "./response.js";

export const rankRoutes = {
  list: route({
    method: "GET",
    url: "/ranks",
    schema: { response: { 200: z.array(rank) } }
  })
};
