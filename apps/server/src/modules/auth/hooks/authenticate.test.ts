import type { FastifyRequest } from "fastify";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiClient } from "@db/enums";

import { findMemberAccessByDiscordId, findMemberAccessById } from "@/modules/members/repository/find-member-access";

import { validateKey } from "../repository/validate-key";
import { hashKey } from "../service/keys";
import { authenticate } from "./authenticate";

vi.mock("@/modules/members/repository/find-member-access", () => ({
  findMemberAccessByDiscordId: vi.fn(),
  findMemberAccessById: vi.fn()
}));
vi.mock("../repository/validate-key", () => ({ validateKey: vi.fn() }));

const TOKEN = "sanity_bot_secret";
const DISCORD_ID = 123_456_789_012_345_678n;
const MEMBER = {
  id: 1n,
  role: null
};

function requestWith(headers: Record<string, string>) {
  return { headers } as FastifyRequest;
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

  it("rejects a bot key with no discord user header", async () => {
    mockKey("bot");
    const request = requestWith(bearer());

    await expect(authenticate(request)).rejects.toMatchObject({ statusCode: 401 });
    expect(findMemberAccessByDiscordId).not.toHaveBeenCalled();
  });

  it("rejects a bot key for a discord user who is not a member", async () => {
    mockKey("bot");
    vi.mocked(findMemberAccessByDiscordId).mockResolvedValue(undefined);
    const request = botRequest();

    await expect(authenticate(request)).rejects.toMatchObject({ statusCode: 401 });
  });

  it("forbids a web key", async () => {
    mockKey("web");
    const request = requestWith(bearer());

    await expect(authenticate(request)).rejects.toMatchObject({ statusCode: 403 });
  });
});
