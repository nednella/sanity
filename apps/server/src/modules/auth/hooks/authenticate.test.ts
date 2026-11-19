import type { FastifyRequest } from "fastify";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiClient } from "@db/enums";

import { findMemberAccessByDiscordId, findMemberAccessById } from "@/modules/members/repository/find-member-access";

import { SESSION_COOKIE } from "../constants";
import { validateKey } from "../repository/validate-key";
import { validateSession } from "../repository/validate-session";
import { hashKey } from "../service/keys";
import { authenticate } from "./authenticate";

vi.mock("@config", () => ({ config: { corsOrigin: "https://sanity.test" } }));
vi.mock("@/modules/members/repository/find-member-access", () => ({
  findMemberAccessByDiscordId: vi.fn(),
  findMemberAccessById: vi.fn()
}));
vi.mock("../repository/validate-key", () => ({ validateKey: vi.fn() }));
vi.mock("../repository/validate-session", () => ({ validateSession: vi.fn() }));

const TOKEN = "sanity_bot_secret";
const SECRET = "sanity_web_secret";
const DISCORD_ID = 123_456_789_012_345_678n;
const MEMBER = {
  id: 1n,
  role: null
};

function requestWith(headers: Record<string, string>, cookies: Record<string, string> = {}, method = "GET") {
  return {
    cookies,
    headers,
    method
  } as unknown as FastifyRequest;
}

function sessionRequest(method = "GET", origin?: string) {
  return requestWith(origin === undefined ? {} : { origin }, { [SESSION_COOKIE]: SECRET }, method);
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
    vi.mocked(validateSession).mockResolvedValue({ memberId: MEMBER.id });
    vi.mocked(findMemberAccessById).mockResolvedValue(MEMBER);
    const request = sessionRequest();

    await authenticate(request);

    expect(validateSession).toHaveBeenCalledWith(hashKey(SECRET));
    expect(request.auth).toEqual({
      client: "web",
      member: MEMBER
    });
  });

  it("rejects an unknown or expired session", async () => {
    vi.mocked(validateSession).mockResolvedValue(undefined);
    const request = sessionRequest();

    await expect(authenticate(request)).rejects.toMatchObject({ statusCode: 401 });
  });

  it("rejects a session whose member has quit", async () => {
    vi.mocked(validateSession).mockResolvedValue({ memberId: MEMBER.id });
    vi.mocked(findMemberAccessById).mockResolvedValue(undefined);
    const request = sessionRequest();

    await expect(authenticate(request)).rejects.toMatchObject({ statusCode: 401 });
  });

  it("forbids a session request that changes data from another origin", async () => {
    const request = sessionRequest("POST", "https://evil.test");

    await expect(authenticate(request)).rejects.toMatchObject({ statusCode: 403 });
    expect(validateSession).not.toHaveBeenCalled();
  });

  it("forbids a session request that changes data with no origin", async () => {
    const request = sessionRequest("DELETE");

    await expect(authenticate(request)).rejects.toMatchObject({ statusCode: 403 });
  });

  it("accepts a session request that changes data from the web client", async () => {
    vi.mocked(validateSession).mockResolvedValue({ memberId: MEMBER.id });
    vi.mocked(findMemberAccessById).mockResolvedValue(MEMBER);
    const request = sessionRequest("PATCH", "https://sanity.test");

    await authenticate(request);

    expect(request.auth).toEqual({
      client: "web",
      member: MEMBER
    });
  });

  it("uses the authorization header over a session cookie", async () => {
    mockKey("bot");
    const request = requestWith(bearer(), { [SESSION_COOKIE]: SECRET });

    await authenticate(request);

    expect(validateSession).not.toHaveBeenCalled();
    expect(request.auth.client).toBe("bot");
  });
});
