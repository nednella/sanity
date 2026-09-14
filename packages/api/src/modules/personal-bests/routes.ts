import { z } from "zod";

import { pagination } from "../../common.js";
import { route } from "../../route.js";
import { contentFilters, recordFilters } from "./request.js";
import { personalBest, rankedPersonalBest } from "./response.js";

export const personalBestRoutes = {
  list: route({
    method: "GET",
    url: "/personal-bests",
    schema: {
      querystring: z.object({
        ...pagination.shape,
        ...contentFilters.shape
      }),
      response: { 200: z.array(personalBest) }
    }
  }),
  listRecords: route({
    method: "GET",
    url: "/personal-bests/records",
    schema: {
      querystring: z.object({
        ...recordFilters.shape,
        ...contentFilters.shape
      }),
      response: { 200: z.array(rankedPersonalBest) }
    }
  })
};
