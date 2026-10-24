import type { FastifyRequest } from "fastify";

import { bigIntString } from "@/schema/codecs";

const BEARER_TOKEN = /^Bearer (\S+)$/i;

/**
 * Reads the token from an `Authorization: Bearer <token>` header.
 *
 * Returns `undefined` when the header is missing or uses another scheme.
 */
export function parseAuthorizationHeader(request: FastifyRequest) {
  const match = BEARER_TOKEN.exec(request.headers.authorization ?? "");
  return match?.[1];
}

/**
 * Reads the Discord ID from an `X-Discord-User-Id` header.
 *
 * Returns `undefined` when the header is missing or is not a Discord ID.
 */
export function parseXDiscordUserIdHeader(request: FastifyRequest) {
  const discordId = bigIntString.safeParse(request.headers["x-discord-user-id"]);
  return discordId.success ? discordId.data : undefined;
}
