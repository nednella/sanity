import { z } from "zod";

import { bigIntString } from "@/schema/codecs";

/**
 * A manual award is the only point change nothing else explains, so it has to say why in its own
 * words. Negative is a deduction, and zero would record nothing.
 */
export const awardPointsBody = z.object({
  memberId: bigIntString,
  points: z
    .number()
    .int()
    .min(-10_000)
    .max(10_000)
    .refine((points) => points !== 0, "Cannot award nothing"),
  notes: z.string().trim().min(1).max(200)
});
