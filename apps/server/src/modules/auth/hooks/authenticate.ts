import type { FastifyRequest } from "fastify";

import type { ApiClient, MemberRole } from "@db/enums";

import { authErrors } from "@/modules/auth/errors";
import { validateKey } from "@/modules/auth/repository/validate-key";
import { hashKey } from "@/modules/auth/service/keys";
import { findMemberAccessByDiscordId, findMemberAccessById } from "@/modules/members/repository/find-member-access";
import { parseAuthorizationHeader, parseXDiscordUserIdHeader } from "@/utils/headers";

export type AuthMember = {
  id: bigint;
  role: MemberRole | null;
};

export type Auth = {
  client: ApiClient;
  // Machine clients do not always have to act on behalf of a member!
  member?: AuthMember;
};

export type ActingAuth = {
  client: ApiClient;
  member: AuthMember;
};

export async function authenticate(request: FastifyRequest) {
  const token = parseAuthorizationHeader(request);
  if (!token) throw authErrors.invalidApiKey();

  const key = await validateKey(hashKey(token));
  if (!key) throw authErrors.invalidApiKey();

  request.auth = {
    client: key.client,
    member: await findRequestingMember(request, key)
  };
}

type ApiKey = NonNullable<Awaited<ReturnType<typeof validateKey>>>;

async function findRequestingMember(request: FastifyRequest, key: ApiKey): Promise<AuthMember | undefined> {
  switch (key.client) {
    case "plugin": {
      // Plugin keys are unique to an active member. If a valid member cannot
      // be matched, then the key is invalid
      const member = await findMemberAccessById(key.memberId!);
      if (member === undefined) throw authErrors.invalidApiKey();

      return member;
    }
    case "bot": {
      // The bot may act on behalf of a user by passing that user's Discord ID
      // in a header. If there's no user then it's a machine request.
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
