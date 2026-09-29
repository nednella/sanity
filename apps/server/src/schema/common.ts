import { z } from "zod";

import { bigIntString } from "./codecs";

export const pagination = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0)
});

export const page = z
  .object({
    limit: z.number().int(),
    offset: z.number().int(),
    total: z.number().int(),
    hasNext: z.boolean(),
    hasPrevious: z.boolean()
  })
  .register(z.globalRegistry, { id: "Page" });

export const paginated = <T extends z.ZodType>(item: T) => z.object({ items: z.array(item), page });

export const toPage = ({ limit, offset, total }: { limit: number; offset: number; total: number }) => ({
  limit,
  offset,
  total,
  hasNext: offset + limit < total,
  hasPrevious: offset > 0
});

// Every status a review can reach. What a list returns is the repository's business, not the shape's.
export const reviewStatus = z
  .enum(["approved", "approved_missing_member", "denied", "deleted_by_user", "pending", "submitted"])
  .register(z.globalRegistry, { id: "ReviewStatus" });

// Drops and personal bests are reviewed the same way, so they are asked for the same thing.
export const reviewBody = z.object({
  status: z.enum(["approved", "denied"]),
  reviewedBy: bigIntString,
  reviewNote: z.string().trim().max(500).nullable().default(null)
});

export const notFound = z.object({ message: z.string() });

export const memberRef = z
  .object({
    id: bigIntString,
    displayName: z.string()
  })
  .register(z.globalRegistry, { id: "MemberRef" });

export type Page = z.output<typeof page>;
