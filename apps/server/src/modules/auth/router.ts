import { z } from "zod";

import { discordAuthorizeUrl } from "@/integrations/discord";
import { errorResponse } from "@/schema/common";
import { defineModule } from "@/utils/define-module";
import { defineRoute } from "@/utils/define-route";

import { authErrors } from "./errors";
import { checkAuthorizationResponse } from "./hooks/check-authorization-response";
import { redirectOAuthLoginError, redirectOAuthProviderSuccess, redirectToOAuthProvider } from "./http/login";
import { sendLoggedOut } from "./http/logout";
import { listKeys } from "./repository/list-keys";
import { revokeKey } from "./repository/revoke-key";
import { apiKeyParams, discordCallbackQuery, discordLoginQuery } from "./request";
import { apiKey, botKey, pluginKey } from "./response";
import { createBotKey } from "./service/create-bot-key";
import { createPluginKey } from "./service/create-plugin-key";
import { loginWithDiscord } from "./service/login-with-discord";
import { logout } from "./service/logout";
import { OAUTH_REDIRECT_COOKIE_NAME, SESSION_COOKIE_NAME } from "./utils/cookies";
import { generateOAuthState } from "./utils/oauth";

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
      querystring: discordLoginQuery,
      response: {
        302: z.void()
      }
    },
    handler: (req, reply) => {
      const state = generateOAuthState();
      const url = discordAuthorizeUrl(state);
      return redirectToOAuthProvider(reply, state, url, req.query.redirect);
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
    preValidation: checkAuthorizationResponse,
    errorHandler: redirectOAuthLoginError,
    handler: async (req, reply) => {
      const secret = await loginWithDiscord(req.query.code, req.headers["user-agent"]);
      return redirectOAuthProviderSuccess(reply, secret, req.cookies[OAUTH_REDIRECT_COOKIE_NAME]);
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
      await logout(req.cookies[SESSION_COOKIE_NAME]);
      return sendLoggedOut(reply);
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
