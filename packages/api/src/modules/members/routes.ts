import { z } from "zod";

import { notFound, paginated, pagination } from "../../common.js";
import { route } from "../../route.js";
import { contentFilters } from "../personal-bests/request.js";
import { rankedPersonalBest } from "../personal-bests/response.js";
import { memberFilters, memberParams, memberPersonalBestFilters, memberSortFilters } from "./request.js";
import { member, memberProfile } from "./response.js";

export const memberRoutes = {
  list: route({
    method: "GET",
    url: "/members",
    schema: {
      querystring: z.object({
        ...pagination.shape,
        ...memberFilters.shape,
        ...memberSortFilters.shape
      }),
      response: { 200: paginated(member) }
    }
  }),
  get: route({
    method: "GET",
    url: "/members/:id",
    schema: {
      params: memberParams,
      response: {
        200: memberProfile,
        404: notFound
      }
    }
  }),
  listPersonalBests: route({
    method: "GET",
    url: "/members/:id/personal-bests",
    schema: {
      params: memberParams,
      querystring: z.object({
        ...pagination.shape,
        ...memberPersonalBestFilters.shape,
        ...contentFilters.shape
      }),
      response: { 200: z.array(rankedPersonalBest) }
    }
  })
};
