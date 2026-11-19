import { z } from "zod";

import { config } from "@config";

import { errorResponse } from "@/schema/common";
import { defineModule } from "@/utils/define-module";
import { defineRoute } from "@/utils/define-route";

import { SESSION_COOKIE, STATE_COOKIE, sessionCookie, stateCookie } from "./constants";
import { authErrors } from "./errors";
import { deleteSession } from "./repository/delete-session";
import { listKeys } from "./repository/list-keys";
import { revokeKey } from "./repository/revoke-key";
import { apiKeyParams, discordCallbackQuery } from "./request";
import { apiKey, botKey, pluginKey } from "./response";
import { createBotKey } from "./service/create-bot-key";
import { createPluginKey } from "./service/create-plugin-key";
import { hashKey } from "./service/keys";
import { signInWithDiscord } from "./service/sign-in-with-discord";
import { startDiscordSignIn } from "./service/start-discord-sign-in";

export const authModule = defineModule([
  defineRoute({
    method: "POST",
    url: "/auth/bot-key",
    config: {
      access: {
        role: "superuser",
        clients: ["bot"]
      }
    },
    schema: {
      response: {
        201: botKey
      }
    },
    handler: async (_req, reply) => {
      const created = await createBotKey();
      return reply.code(201).send(created);
    }
  }),

  defineRoute({
    method: "GET",
    url: "/auth/discord",
    config: {
      access: "public"
    },
    schema: {
      response: {
        302: z.void()
      }
    },
    handler: async (_req, reply) => {
      const { state, url } = startDiscordSignIn();
      reply.setCookie(STATE_COOKIE, state, stateCookie);

      return reply.redirect(url);
    }
  }),

  defineRoute({
    method: "GET",
    url: "/auth/discord/callback",
    config: {
      access: "public"
    },
    schema: {
      querystring: discordCallbackQuery,
      response: {
        302: z.void()
      }
    },
    handler: async (req, reply) => {
      const { code, state } = req.query;
      const startedState = req.cookies[STATE_COOKIE];
      reply.clearCookie(STATE_COOKIE, stateCookie);

      // A state that differs from the cookie means this browser did not start
      // the sign-in, so the code may be someone else's.
      if (code === undefined || state === undefined || state !== startedState) {
        return reply.redirect(signInErrorUrl("failed"));
      }

      const signIn = await signInWithDiscord(code, req.headers["user-agent"]);
      if ("error" in signIn) return reply.redirect(signInErrorUrl(signIn.error));

      reply.setCookie(SESSION_COOKIE, signIn.secret, sessionCookie);
      return reply.redirect(webUrl);
    }
  }),

  defineRoute({
    method: "GET",
    url: "/auth/keys",
    config: {
      access: {
        role: "superuser",
        clients: ["bot"]
      }
    },
    schema: {
      response: {
        200: z.array(apiKey)
      }
    },
    handler: () => listKeys()
  }),

  defineRoute({
    method: "DELETE",
    url: "/auth/keys/:id",
    config: {
      access: {
        role: "superuser",
        clients: ["bot"]
      }
    },
    schema: {
      params: apiKeyParams,
      response: {
        204: z.void(),
        404: errorResponse
      }
    },
    handler: async (req, reply) => {
      const revoked = await revokeKey(req.params.id);
      if (!revoked) throw authErrors.apiKeyNotFound(req.params.id);

      return reply.code(204).send();
    }
  }),

  defineRoute({
    method: "POST",
    url: "/auth/logout",
    config: {
      access: "public"
    },
    schema: {
      response: {
        204: z.void()
      }
    },
    handler: async (req, reply) => {
      const secret = req.cookies[SESSION_COOKIE];
      if (secret !== undefined) await deleteSession(hashKey(secret));

      reply.clearCookie(SESSION_COOKIE, sessionCookie);
      return reply.code(204).send();
    }
  }),

  defineRoute({
    method: "POST",
    url: "/auth/plugin-key",
    config: {
      access: {
        role: "*",
        clients: ["bot"]
      }
    },
    schema: {
      response: {
        201: pluginKey,
        403: errorResponse
      }
    },
    handler: async (req, reply) => {
      const key = await createPluginKey(req.auth);
      return reply.code(201).send({ key });
    }
  })
]);

const { webUrl } = config;

function signInErrorUrl(error: string) {
  return `${webUrl}/?${new URLSearchParams({ signIn: error })}`;
}
