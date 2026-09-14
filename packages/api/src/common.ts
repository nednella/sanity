import { z } from "zod";

import { bigIntString } from "./codecs.js";

export const pagination = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0)
});

export const notFound = z.object({ message: z.string() });

export const memberRef = z.object({
  id: bigIntString,
  displayName: z.string()
});
