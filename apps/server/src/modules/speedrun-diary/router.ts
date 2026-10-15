import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { notFound } from "@/schema/common";

import { diaryTimeBody, diaryTimeParams } from "./request";
import { diary } from "./response";
import { editDiaryTime } from "./service/edit-diary-time";
import { getDiaries } from "./service/get-diaries";

export const speedrunDiaryRouter: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: "GET",
    url: "/speedrun-diary",
    schema: { response: { 200: z.array(diary) } },
    handler: async () => getDiaries()
  });
};

export const adminSpeedrunDiaryRouter: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: "PUT",
    url: "/speedrun-diary/:contentId/:scale/:tierId",
    schema: {
      params: diaryTimeParams,
      body: diaryTimeBody,
      response: { 204: z.void(), 404: notFound }
    },
    handler: async (req, reply) => {
      const edited = await editDiaryTime(req.params, req.body);
      if (!edited) return reply.code(404).send({ message: "Diary time not found." });

      return reply.code(204).send();
    }
  });
};
