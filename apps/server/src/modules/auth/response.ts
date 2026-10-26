import { z } from "zod";

import { apiClient } from "@db/enums";

import { bigIntString, isoDate } from "@/schema/codecs";

export const apiKey = z
  .object({
    id: z.number(),
    client: z.enum(apiClient.enumValues),
    memberId: bigIntString.nullable(),
    createdAt: isoDate,
    lastUsedAt: isoDate.nullable(),
    revokedAt: isoDate.nullable()
  })
  .register(z.globalRegistry, { id: "ApiKey" });

export const botKey = z.object({
  id: z.number(),
  key: z.string()
});

export const pluginKey = z.object({ key: z.string() });
