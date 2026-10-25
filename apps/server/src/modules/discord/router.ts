import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { listChannels } from "./repository/list-channels";
import { channelParams, saveAvatarsBody, setChannelBody, updateDiscordAccountBody } from "./request";
import { discordChannels, savedAvatars, updatedDiscordAccount } from "./response";
import { clearDiscordChannel } from "./service/clear-channel";
import { saveAvatars } from "./service/save-avatars";
import { setDiscordChannel } from "./service/set-channel";
import { updateDiscordAccount } from "./service/update-discord-account";

export const adminDiscordRouter: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: "GET",
    url: "/discord/channels",
    schema: { response: { 200: discordChannels } },
    handler: () => listChannels()
  });

  app.route({
    method: "DELETE",
    url: "/discord/channels/:purpose",
    schema: { params: channelParams, response: { 204: z.void() } },
    handler: async (req, reply) => {
      await clearDiscordChannel(req.params, req.auth);
      return reply.code(204).send();
    }
  });

  app.route({
    method: "PUT",
    url: "/discord/channels/:purpose",
    schema: { params: channelParams, body: setChannelBody, response: { 204: z.void() } },
    handler: async (req, reply) => {
      await setDiscordChannel({ ...req.params, ...req.body }, req.auth);
      return reply.code(204).send();
    }
  });

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
    handler: async (req) => updateDiscordAccount(req.body, req.auth)
  });
};
