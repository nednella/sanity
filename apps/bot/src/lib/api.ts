import { AsyncLocalStorage } from "node:async_hooks";

import { type Middleware, createWrappedApiClient } from "@sanity/api";

import { config } from "@config";

const commandUser = new AsyncLocalStorage<string>();

/**
 * Runs a command so that every API call it makes names the Discord user who
 * ran it, in the `X-Discord-User-Id` header.
 */
export function runAsDiscordUserId(discordUserId: string, command: () => Promise<unknown>) {
  return commandUser.run(discordUserId, command);
}

const apiKeyHeader: Middleware = {
  onRequest({ request }) {
    request.headers.set("Authorization", `Bearer ${config.apiKey}`);
  }
};

const discordUserHeader: Middleware = {
  onRequest({ request }) {
    const discordUserId = commandUser.getStore();
    if (discordUserId) request.headers.set("X-Discord-User-Id", discordUserId);
  }
};

export const api = createWrappedApiClient(config.apiUrl, { middleware: [apiKeyHeader, discordUserHeader] });
