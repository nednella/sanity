import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { updateDiscordAccountBody } from "./request";
import { updatedDiscordAccount } from "./response";
import { updateDiscordAccount } from "./service/update-discord-account";

export const adminDiscordRouter: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: "POST",
    url: "/discord/update-account",
    schema: { body: updateDiscordAccountBody, response: { 200: updatedDiscordAccount } },
    handler: async (req) => updateDiscordAccount(req.body)
  });
};
