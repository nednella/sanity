import { z } from "zod";

import { bigIntString } from "@/schema/codecs";
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

export const submissionParams = z.object({ id: z.coerce.number().int().positive() });

export const createSubmissionBody = z.object({
  submittedByMemberId: bigIntString,
  itemId: z.number().int().positive().nullable().default(null),
  itemName: z.string().trim().min(1).max(100).nullable().default(null),
  valueMillions: z.number().int().min(0).nullable().default(null),
  nonClanCount: z.number().int().min(0).default(0),
  imageUrl: z.url().nullable().default(null),
  discordMessageUrl: z.url().nullable().default(null),
  event: event.nullable().default(null),
  participants: z.array(bigIntString).min(1)
});

export const reviewSubmissionBody = z.object({
  status: z.enum(["approved", "denied"]),
  reviewedBy: bigIntString,
  reviewNote: z.string().trim().max(500).nullable().default(null)
});
