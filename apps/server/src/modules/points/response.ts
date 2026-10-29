import { z } from "zod";

import { isoDate } from "@/schema/codecs";
import { memberRef } from "@/schema/common";

const pointMultiplier = z
  .object({
    id: z.number(),
    value: z.number(),
    bossName: z.string().nullable(),
    member: memberRef.nullable(),
    reason: z.string(),
    startsAt: isoDate,
    endsAt: isoDate
  })
  .register(z.globalRegistry, { id: "PointMultiplier" });

export const addedMultipliers = z.object({ multipliers: z.array(pointMultiplier) });

export const awardedPoints = z.object({ awarded: z.number() });
