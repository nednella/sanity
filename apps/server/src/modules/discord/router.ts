import { z } from "zod";

import { defineModule } from "@/utils/define-module";
import { defineRoute } from "@/utils/define-route";

import { listChannels } from "./repository/list-channels";
import { channelParams, saveAvatarsBody, setChannelBody, updateDiscordAccountBody } from "./request";
import { discordChannels, savedAvatars, updatedDiscordAccount } from "./response";
import { clearDiscordChannel } from "./service/clear-channel";
import { saveAvatars } from "./service/save-avatars";
import { setDiscordChannel } from "./service/set-channel";
import { updateDiscordAccount } from "./service/update-discord-account";

export const discordModule = defineModule([
  defineRoute({
    method: "GET",
    url: "/discord/channels",
    config: {
      access: {
        role: "admin",
        clients: ["bot"]
      }
    },
    schema: {
      response: {
        200: discordChannels
      }
    },
    handler: () => listChannels()
  }),

  defineRoute({
    method: "DELETE",
    url: "/discord/channels/:purpose",
    config: {
      access: {
        role: "admin",
        clients: ["bot"]
      }
    },
    schema: {
      params: channelParams,
      response: {
        204: z.void()
      }
    },
    handler: async (req, reply) => {
      await clearDiscordChannel(req.params, req.auth);
      return reply.code(204).send();
    }
  }),

  defineRoute({
    method: "PUT",
    url: "/discord/channels/:purpose",
    config: {
      access: {
        role: "admin",
        clients: ["bot"]
      }
    },
    schema: {
      params: channelParams,
      body: setChannelBody,
      response: {
        204: z.void()
      }
    },
    handler: async (req, reply) => {
      await setDiscordChannel({ ...req.params, ...req.body }, req.auth);
      return reply.code(204).send();
    }
  }),

  defineRoute({
    method: "POST",
    url: "/discord/avatars",
    config: {
      access: {
        role: "admin",
        clients: ["bot"]
      }
    },
    schema: {
      body: saveAvatarsBody,
      response: {
        200: savedAvatars
      }
    },
    handler: async (req) => ({ saved: await saveAvatars(req.body.avatars) })
  }),

  defineRoute({
    method: "POST",
    url: "/discord/update-account",
    config: {
      access: {
        role: "admin",
        clients: ["bot"]
      }
    },
    schema: {
      body: updateDiscordAccountBody,
      response: {
        200: updatedDiscordAccount
      }
    },
    handler: async (req) => updateDiscordAccount(req.body, req.auth)
  })
]);
