import type { FastifyRequest } from "fastify";

import type { ApiClient } from "@db/enums";

import { findClanMemberIdByDiscordId } from "@/modules/members/repository/find-member-id-by-discord-id";
import { parseAuthorizationHeader, parseXDiscordUserIdHeader } from "@/utils/headers";

import { authErrors } from "../errors";
import { validateApiKey } from "../repository/validate-api-key";
import { hashApiKey } from "../service/keys";

export type AuthMember = {
  id: bigint;
};

export type Auth = {
  client: ApiClient;
  member: AuthMember;
};

declare module "fastify" {
  interface FastifyRequest {
    auth: Auth;
  }
}

export async function authenticate(request: FastifyRequest) {
  const token = parseAuthorizationHeader(request);
  if (!token) throw authErrors.invalidApiKey();

  const key = await validateApiKey(hashApiKey(token));
  if (!key) throw authErrors.invalidApiKey();

  // identify the acting user based on the key's client
  const memberId = await findRequestingMemberId(request, key);
  if (memberId === undefined) throw authErrors.invalidApiKey();

  request.auth = {
    client: key.client,
    member: { id: memberId }
  };
}

type ApiKey = NonNullable<Awaited<ReturnType<typeof validateApiKey>>>;

async function findRequestingMemberId(request: FastifyRequest, key: ApiKey): Promise<bigint | undefined> {
  switch (key.client) {
    case "plugin": {
      // plugin keys are unique to a member
      return key.memberId!;
    }
    case "bot": {
      // bot commands on behalf of a user pass that user's Discord ID in a header
      const discordId = parseXDiscordUserIdHeader(request);
      if (discordId === undefined) return;

      return await findClanMemberIdByDiscordId(discordId);
    }
    case "web": {
      // web client support not implemented yet
      throw authErrors.forbidden();
    }
  }
}
