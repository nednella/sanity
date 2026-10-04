import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { saveAvatarsBody, updateDiscordAccountBody } from "./request";
import { savedAvatars, updatedDiscordAccount } from "./response";
import { saveAvatars } from "./service/save-avatars";
import { updateDiscordAccount } from "./service/update-discord-account";

export const adminDiscordRouter: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: "POST",
    url: "/discord/avatars",
    schema: { body: saveAvatarsBody, response: { 200: savedAvatars } },
    handler: async (req) => ({ saved: await saveAvatars(req.body.avatars) })
  });

  app.route({
    method: "POST",
    url: "/discord/update-account",
    schema: { body: updateDiscordAccountBody, response: { 200: updatedDiscordAccount } },
    handler: async (req) => updateDiscordAccount(req.body)
  });
};
