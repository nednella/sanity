import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { submissionEvent } from "../../../db/schema.js";
import { bigIntString, memberRef, pagination } from "../../lib/zod.js";
import { getSubmissions } from "./service.js";

const event = z.enum(submissionEvent.enumValues);

const item = z.object({
  id: z.number().nullable(),
  name: z.string().nullable()
});

const participant = memberRef.extend({
  points: z.number().nullable()
});

const submission = z.object({
  id: z.number(),
  item,
  valueMillions: z.number().nullable(),
  event: event.nullable(),
  imageUrl: z.string().nullable(),
  discordMessageUrl: z.string().nullable(),
  submittedAt: z.date(),
  submittedBy: memberRef,
  participants: z.array(participant)
});

const submissionFilters = z.object({
  memberId: bigIntString.optional(),
  event: event.optional()
});

export const submissionRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/",
    {
      schema: {
        querystring: z.object({ ...pagination.shape, ...submissionFilters.shape }),
        response: { 200: z.array(submission) }
      }
    },
    async (req) => getSubmissions(req.query)
  );
};
