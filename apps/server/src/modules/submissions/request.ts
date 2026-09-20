import { z } from "zod";

import { bigIntString } from "@/schema/codecs";
import { pagination } from "@/schema/common";

import { event } from "./response";

const submissionFilters = z.object({
  memberId: bigIntString.optional(),
  event: event.optional()
});

export const submissionListQuery = z.object({
  ...pagination.shape,
  ...submissionFilters.shape
});
