import { z } from "zod";

// Discord snowflake IDs exceed Number.MAX_SAFE_INTEGER, so we map bigint into string.
export const bigIntString = z.codec(z.string().regex(/^\d+$/), z.bigint(), {
  decode: BigInt,
  encode: (value) => value.toString()
});

export const pagination = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0)
});

// A query string is text, so a plain coercion would read "false" as true.
export const booleanString = z.enum(["true", "false"]).transform((value) => value === "true");

export const notFound = z.object({ message: z.string() });

export const memberRef = z.object({
  id: bigIntString,
  displayName: z.string()
});
