import type { FastifyRequest } from "fastify";

import { config } from "@config";
import type { ApiClient, MemberRole } from "@db/enums";

import { findMemberAccessByDiscordId, findMemberAccessById } from "@/modules/members/repository/find-member-access";
import { parseAuthorizationHeader, parseXDiscordUserIdHeader } from "@/utils/headers";

import { SESSION_COOKIE } from "../constants";
import { authErrors } from "../errors";
import { validateKey } from "../repository/validate-key";
import { validateSession } from "../repository/validate-session";
import { hashKey } from "../service/keys";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

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
  if (token !== undefined) {
    request.auth = await authenticateKey(request, token);
    return;
  }

  const secret = request.cookies[SESSION_COOKIE];
  if (secret !== undefined) {
    request.auth = await authenticateSession(request, secret);
    return;
  }

  throw authErrors.invalidApiKey();
}

async function authenticateKey(request: FastifyRequest, token: string): Promise<Auth> {
  const key = await validateKey(hashKey(token));
  if (!key) throw authErrors.invalidApiKey();

  return {
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
      // The web client signs in with a session cookie, never with a key.
      throw authErrors.forbidden();
    }
  }
}

async function authenticateSession(request: FastifyRequest, secret: string): Promise<ActingAuth> {
  // The browser sends the cookie with any request to the API, so a request
  // that changes data must come from the web client's own pages.
  if (!SAFE_METHODS.has(request.method) && request.headers.origin !== config.corsOrigin) {
    throw authErrors.forbidden();
  }

  const session = await validateSession(hashKey(secret));
  if (!session) throw authErrors.invalidSession();

  // A member who has left the clan loses access, even with a live session.
  const member = await findMemberAccessById(session.memberId);
  if (member === undefined) throw authErrors.invalidSession();

  return {
    client: "web",
    member
  };
}
