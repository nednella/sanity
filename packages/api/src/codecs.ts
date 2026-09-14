import { z } from "zod";

// Discord snowflake IDs exceed Number.MAX_SAFE_INTEGER, so we map bigint into string.
export const bigIntString = z.codec(z.string().regex(/^\d+$/), z.bigint(), {
  decode: BigInt,
  encode: (value) => value.toString()
});

// Dates travel as ISO strings, so both sides work with a Date.
export const isoDate = z.codec(z.iso.datetime({ offset: true }), z.date(), {
  decode: (value) => new Date(value),
  encode: (value) => value.toISOString()
});

// A query string is text, so a plain coercion would read "false" as true.
export const booleanString = z.codec(z.enum(["true", "false"]), z.boolean(), {
  decode: (value) => value === "true",
  encode: (value) => (value ? "true" : "false")
});
