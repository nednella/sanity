import { z } from "zod";

import { apiClient } from "@db/enums";

import { isoDate } from "@/schema/codecs";
import { memberRef, reviewStatus } from "@/schema/common";

const item = z.object({
  id: z.number().nullable(),
  name: z.string().nullable(),
  osrsItemId: z.number().nullable()
});

const participant = memberRef.extend({ points: z.number().nullable() });

export const event = z.enum(["bingo", "leagues"]);

export const submission = z
  .object({
    id: z.number(),
    item,
    valueMillions: z.number().nullable(),
    event: event.nullable(),
    status: reviewStatus,
    imageUrl: z.string().nullable(),
    discordMessageUrl: z.string().nullable(),
    submittedAt: isoDate,
    submittedBy: memberRef,
    source: z.enum(apiClient.enumValues),
    participants: z.array(participant)
  })
  .register(z.globalRegistry, { id: "Submission" });

export const createdSubmission = z.object({ id: z.number() });
