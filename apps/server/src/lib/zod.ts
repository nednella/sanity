import { z } from "zod";

// Discord snowflake IDs exceed Number.MAX_SAFE_INTEGER, so we map bigint into string.
export const bigIntString = z.codec(z.string().regex(/^\d+$/), z.bigint(), {
  decode: BigInt,
  encode: (value) => value.toString()
});
