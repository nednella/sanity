import { z } from "zod";

import { pagination } from "../../common.js";
import { route } from "../../route.js";
import { submissionFilters } from "./request.js";
import { submission } from "./response.js";

export const submissionRoutes = {
  list: route({
    method: "GET",
    url: "/submissions",
    schema: {
      querystring: z.object({
        ...pagination.shape,
        ...submissionFilters.shape
      }),
      response: { 200: z.array(submission) }
    }
  })
};
