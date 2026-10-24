import type { FastifyRequest } from "fastify";

import type { ApiClient } from "@db/enums";

import { findClanMemberIdByDiscordId } from "@/modules/members/repository/find-member-id-by-discord-id";
import { parseAuthorizationHeader, parseXDiscordUserIdHeader } from "@/utils/headers";

import { authErrors } from "../errors";
import { recordApiKeyUsage } from "../repository/record-api-key-usage";
import { hashApiKey } from "./keys";

export type Actor = {
  memberId: bigint;
  source: ApiClient;
};

declare module "fastify" {
  interface FastifyRequest {
    actor: Actor;
  }
}

/**
 * The hook that guards a route group. Add it once per group in `routes.ts`:
 *
 * ```ts
 * app.addHook("onRequest", authenticate);
 * ```
 *
 * A request without a valid key gets a 401. A request with a valid key but no
 * requesting member gets a 403. Otherwise the hook sets `request.actor`.
 */
export async function authenticate(request: FastifyRequest) {
  const key = await findApiKey(request);
  if (!key) throw authErrors.invalidApiKey();

  const memberId = await findRequestingMemberId(request, key.memberId);
  if (memberId === undefined) throw authErrors.forbidden();

  request.actor = {
    memberId,
    source: key.client
  };
}

/**
 * Finds the live key that a request sends, and stamps its `last_used_at`.
 *
 * Returns `undefined` when the key is missing, unknown or revoked.
 */
async function findApiKey(request: FastifyRequest) {
  const token = parseAuthorizationHeader(request);
  if (token === undefined) return;

  return await recordApiKeyUsage(hashApiKey(token));
}

/**
 * Finds the member that a request comes from.
 *
 * - A RuneLite plugin key belongs to 1 member, so the request belongs to them.
 * - The bot sends the Discord ID of the person who ran the command in the
 *   `X-Discord-User-Id` header. That person must be a member who has not quit.
 *
 * Returns `undefined` when no such member is found.
 */
async function findRequestingMemberId(request: FastifyRequest, keyMemberId: bigint | null) {
  if (keyMemberId !== null) return keyMemberId;

  const discordId = parseXDiscordUserIdHeader(request);
  if (discordId === undefined) return;

  return await findClanMemberIdByDiscordId(discordId);
}
