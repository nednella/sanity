import type { FastifyRequest } from "fastify";

import type { ApiClient, MemberRole } from "@db/enums";

import { authErrors } from "@/modules/auth/errors";
import { validateKey } from "@/modules/auth/repository/validate-key";
import { validateSession } from "@/modules/auth/repository/validate-session";
import { SESSION_COOKIE_NAME } from "@/modules/auth/utils/cookies";
import { hashKey } from "@/modules/auth/utils/keys";
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
  // Machine clients authenticate with a key, not a session.
  sessionId?: number;
};

export type ActingAuth = {
  client: ApiClient;
  member: AuthMember;
};

export type SessionAuth = {
  client: ApiClient;
  member: AuthMember;
  sessionId: number;
};

export async function authenticate(request: FastifyRequest) {
  const token = parseAuthorizationHeader(request);
  if (token !== undefined) {
    request.auth = await authenticateToken(request, token);
    return;
  }

  const secret = request.cookies[SESSION_COOKIE_NAME];
  if (secret !== undefined) {
    request.auth = await authenticateSession(secret);
    return;
  }

  throw authErrors.invalidApiKey();
}

async function authenticateToken(request: FastifyRequest, token: string): Promise<Auth> {
  const key = await validateKey(hashKey(token));
  if (!key) throw authErrors.invalidApiKey();

  return {
    client: key.client,
    member: await findRequestingMember(request, key)
  };
}

async function authenticateSession(secret: string): Promise<SessionAuth> {
  const session = await validateSession(hashKey(secret));
  if (session === undefined) throw authErrors.invalidSession();

  // Sessions are unique to an active member. If a valid member cannot be
  // matched, then the session is invalid
  const member = await findMemberAccessById(session.memberId);
  if (member === undefined) throw authErrors.invalidSession();

  return {
    client: "web",
    member,
    sessionId: session.id
  };
}

type AuthKey = NonNullable<Awaited<ReturnType<typeof validateKey>>>;

async function findRequestingMember(request: FastifyRequest, key: AuthKey): Promise<AuthMember | undefined> {
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
      // Web client uses session cookies to authenticate.
      throw authErrors.forbidden();
    }
  }
}
