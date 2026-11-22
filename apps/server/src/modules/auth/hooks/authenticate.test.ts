import type { FastifyRequest } from "fastify";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiClient } from "@db/enums";

import { validateKey } from "@/modules/auth/repository/validate-key";
import { validateSession } from "@/modules/auth/repository/validate-session";
import { SESSION_COOKIE_NAME } from "@/modules/auth/utils/cookies";
import { hashKey } from "@/modules/auth/utils/keys";
import { findMemberAccessByDiscordId, findMemberAccessById } from "@/modules/members/repository/find-member-access";

import { authenticate } from "./authenticate";

vi.mock("@/modules/members/repository/find-member-access", () => ({
  findMemberAccessByDiscordId: vi.fn(),
  findMemberAccessById: vi.fn()
}));
vi.mock("@/modules/auth/repository/validate-key", () => ({ validateKey: vi.fn() }));
vi.mock("@/modules/auth/repository/validate-session", () => ({ validateSession: vi.fn() }));

const TOKEN = "sanity_bot_secret";
const SECRET = "sanity_web_secret";
const SESSION_ID = 7;
const DISCORD_ID = 123_456_789_012_345_678n;
const MEMBER = {
  id: 1n,
  role: null
};

function requestWith(headers: Record<string, string>, cookies: Record<string, string> = {}) {
  return {
    cookies,
    headers
  } as unknown as FastifyRequest;
}

function sessionRequest() {
  return requestWith({}, { [SESSION_COOKIE_NAME]: SECRET });
}

function bearer() {
  return { authorization: `Bearer ${TOKEN}` };
}

function botRequest() {
  return requestWith({
    ...bearer(),
    "x-discord-user-id": DISCORD_ID.toString()
  });
}

function mockSession() {
  vi.mocked(validateSession).mockResolvedValue({
    id: SESSION_ID,
    memberId: MEMBER.id
  });
}

function mockKey(client: ApiClient, memberId: bigint | null = null) {
  vi.mocked(validateKey).mockResolvedValue({
    client,
    memberId
  });
}

describe("authenticate", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("rejects a request with no authorization header", async () => {
    const request = requestWith({});

    await expect(authenticate(request)).rejects.toMatchObject({ statusCode: 401 });
    expect(validateKey).not.toHaveBeenCalled();
  });

  it("rejects an authorization header that is not a bearer token", async () => {
    const request = requestWith({ authorization: `Basic ${TOKEN}` });

    await expect(authenticate(request)).rejects.toMatchObject({ statusCode: 401 });
  });

  it("rejects an unknown or revoked key, looked up by its hash", async () => {
    vi.mocked(validateKey).mockResolvedValue(undefined);
    const request = requestWith(bearer());

    await expect(authenticate(request)).rejects.toMatchObject({ statusCode: 401 });
    expect(validateKey).toHaveBeenCalledWith(hashKey(TOKEN));
  });

  it("acts as the member who owns a plugin key", async () => {
    mockKey("plugin", MEMBER.id);
    vi.mocked(findMemberAccessById).mockResolvedValue(MEMBER);
    const request = requestWith(bearer());

    await authenticate(request);

    expect(findMemberAccessById).toHaveBeenCalledWith(MEMBER.id);
    expect(request.auth).toEqual({
      client: "plugin",
      member: MEMBER
    });
  });

  it("rejects a plugin key whose member has quit", async () => {
    mockKey("plugin", MEMBER.id);
    vi.mocked(findMemberAccessById).mockResolvedValue(undefined);
    const request = requestWith(bearer());

    await expect(authenticate(request)).rejects.toMatchObject({ statusCode: 401 });
  });

  it("acts as the member named by the discord user header on a bot key", async () => {
    mockKey("bot");
    vi.mocked(findMemberAccessByDiscordId).mockResolvedValue(MEMBER);
    const request = botRequest();

    await authenticate(request);

    expect(findMemberAccessByDiscordId).toHaveBeenCalledWith(DISCORD_ID);
    expect(request.auth).toEqual({
      client: "bot",
      member: MEMBER
    });
  });

  it("names no member for a bot key with no discord user header", async () => {
    mockKey("bot");
    const request = requestWith(bearer());

    await authenticate(request);

    expect(findMemberAccessByDiscordId).not.toHaveBeenCalled();
    expect(request.auth).toEqual({
      client: "bot",
      member: undefined
    });
  });

  it("names no member for a discord user who is not a member", async () => {
    mockKey("bot");
    vi.mocked(findMemberAccessByDiscordId).mockResolvedValue(undefined);
    const request = botRequest();

    await authenticate(request);

    expect(request.auth).toEqual({
      client: "bot",
      member: undefined
    });
  });

  it("forbids a web key", async () => {
    mockKey("web");
    const request = requestWith(bearer());

    await expect(authenticate(request)).rejects.toMatchObject({ statusCode: 403 });
  });

  it("acts as the member who owns a session cookie", async () => {
    mockSession();
    vi.mocked(findMemberAccessById).mockResolvedValue(MEMBER);
    const request = sessionRequest();

    await authenticate(request);

    expect(validateSession).toHaveBeenCalledWith(hashKey(SECRET));
    expect(request.auth).toEqual({
      client: "web",
      member: MEMBER,
      sessionId: SESSION_ID
    });
  });

  it("rejects an unknown or expired session", async () => {
    vi.mocked(validateSession).mockResolvedValue(undefined);
    const request = sessionRequest();

    await expect(authenticate(request)).rejects.toMatchObject({ statusCode: 401 });
    expect(findMemberAccessById).not.toHaveBeenCalled();
  });

  it("rejects a session whose member has quit", async () => {
    mockSession();
    vi.mocked(findMemberAccessById).mockResolvedValue(undefined);
    const request = sessionRequest();

    await expect(authenticate(request)).rejects.toMatchObject({ statusCode: 401 });
  });

  it("uses the authorization header over a session cookie", async () => {
    mockKey("bot");
    const request = requestWith(bearer(), { [SESSION_COOKIE_NAME]: SECRET });

    await authenticate(request);

    expect(validateSession).not.toHaveBeenCalled();
    expect(request.auth.client).toBe("bot");
  });
});
