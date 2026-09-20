import { z } from "zod";

import { bigIntString } from "../../schema/codecs.js";
import { pagination } from "../../schema/common.js";
import { event } from "./response.js";

export const submissionFilters = z.object({
  memberId: bigIntString.optional(),
  event: event.optional()
});

export const submissionListQuery = z.object({
  ...pagination.shape,
  ...submissionFilters.shape
});
