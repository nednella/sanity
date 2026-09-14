import { z } from "zod";

import { isoDate } from "../../codecs.js";
import { memberRef } from "../../common.js";

const item = z.object({
  id: z.number().nullable(),
  name: z.string().nullable()
});

const participant = memberRef.extend({ points: z.number().nullable() });

export const event = z.enum(["bingo", "leagues"]);

export const submission = z.object({
  id: z.number(),
  item,
  valueMillions: z.number().nullable(),
  event: event.nullable(),
  imageUrl: z.string().nullable(),
  discordMessageUrl: z.string().nullable(),
  submittedAt: isoDate,
  submittedBy: memberRef,
  participants: z.array(participant)
});
