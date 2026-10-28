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

/**
 * A multiplier starts when it is added. Each tagged member gets their own, and with nobody tagged it
 * applies to everyone. A boss limits it to the drops that boss can give.
 */
export const addMultipliersBody = z.object({
  bossName: z.string().trim().min(1).max(64).nullable().default(null),
  days: z.number().int().min(1).max(12),
  reason: z.string().trim().min(1).max(200),
  taggedDiscordIds: z.array(bigIntString).max(50).default([]),
  value: z.number().min(1.1).max(2)
});
