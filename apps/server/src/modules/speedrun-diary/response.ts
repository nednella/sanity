import { z } from "zod";

const tier = z.object({
  id: z.number(),
  name: z.string(),
  points: z.number()
});

export const memberDiary = z
  .object({
    content: z.object({
      id: z.number(),
      name: z.string(),
      imageUrl: z.string().nullable()
    }),
    scale: z.number(),
    timeSeconds: z.number().nullable(),
    tier: tier.nullable(),
    nextTier: tier.extend({ timeSeconds: z.number() }).nullable()
  })
  .register(z.globalRegistry, { id: "MemberDiary" });
