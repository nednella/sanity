import { z } from "zod";

import { errorResponse } from "@/schema/common";
import { defineModule } from "@/utils/define-module";
import { defineRoute } from "@/utils/define-route";

import { authErrors } from "./errors";
import { listKeys } from "./repository/list-keys";
import { revokeKey } from "./repository/revoke-key";
import { apiKeyParams } from "./request";
import { apiKey, botKey, pluginKey } from "./response";
import { createBotKey } from "./service/create-bot-key";
import { createPluginKey } from "./service/create-plugin-key";

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
