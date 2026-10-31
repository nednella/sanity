import type { FastifyRequest } from "fastify";

import type { ApiClient, MemberRole } from "@db/enums";

import { findMemberAccessByDiscordId, findMemberAccessById } from "@/modules/members/repository/find-member-access";
import { parseAuthorizationHeader, parseXDiscordUserIdHeader } from "@/utils/headers";

import { authErrors } from "../errors";
import { validateKey } from "../repository/validate-key";
import { hashKey } from "../service/keys";

export type AuthMember = {
  id: bigint;
  role: MemberRole | null;
};

export type Auth = {
  client: ApiClient;
  member: AuthMember;
};

export async function authenticate(request: FastifyRequest) {
  const token = parseAuthorizationHeader(request);
  if (!token) throw authErrors.invalidApiKey();

  const key = await validateKey(hashKey(token));
  if (!key) throw authErrors.invalidApiKey();

  // identify the acting user based on the key's client
  const member = await findRequestingMember(request, key);
  if (member === undefined) throw authErrors.invalidApiKey();

  request.auth = {
    client: key.client,
    member
  };
}

type ApiKey = NonNullable<Awaited<ReturnType<typeof validateKey>>>;

async function findRequestingMember(request: FastifyRequest, key: ApiKey): Promise<AuthMember | undefined> {
  switch (key.client) {
    case "plugin": {
      // plugin keys are unique to a member
      return await findMemberAccessById(key.memberId!);
    }
    case "bot": {
      // the bot acts for a user by passing that user's Discord ID in a header
      const discordId = parseXDiscordUserIdHeader(request);
      if (discordId === undefined) return;

      return await findMemberAccessByDiscordId(discordId);
    }
    case "web": {
      // web client support not implemented yet
      throw authErrors.forbidden();
    }
  }
}
