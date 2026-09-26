import { z } from "zod";

import { pagination } from "@/schema/common";

import { event } from "./response";

const submissionFilters = z.object({
  event: event.optional()
});

const submissionSort = z
  .enum(["item", "submittedAt", "valueMillions"])
  .register(z.globalRegistry, { id: "SubmissionSort" });

export const submissionSortFilters = z.object({
  sort: submissionSort.default("submittedAt"),
  order: z.enum(["asc", "desc"]).default("desc")
});

export type SubmissionSort = z.output<typeof submissionSort>;

export const submissionListQuery = z.object({
  ...pagination.shape,
  ...submissionFilters.shape,
  ...submissionSortFilters.shape
});
