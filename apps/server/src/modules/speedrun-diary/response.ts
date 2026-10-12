import { z } from "zod";

const content = z.object({
  id: z.number(),
  name: z.string(),
  metric: z.string().nullable(),
  imageUrl: z.string().nullable()
});

const tier = z.object({
  id: z.number(),
  name: z.string(),
  points: z.number()
});

const tierTime = tier.extend({ timeSeconds: z.number() });

const scaleTimes = z.object({
  scale: z.number(),
  tiers: z.array(tierTime)
});

export const diary = z
  .object({
    content,
    scales: z.array(scaleTimes)
  })
  .register(z.globalRegistry, { id: "Diary" });

export const memberDiary = z
  .object({
    content,
    scale: z.number(),
    pb: z
      .object({
        id: z.number(),
        timeSeconds: z.number(),
        imageUrl: z.string().nullable()
      })
      .nullable(),
    tier: tier.nullable(),
    nextTier: tierTime.nullable()
  })
  .register(z.globalRegistry, { id: "MemberDiary" });
