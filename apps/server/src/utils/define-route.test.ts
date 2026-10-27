import rateLimit from "@fastify/rate-limit";
import Fastify from "fastify";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { validateKey } from "@/modules/auth/repository/validate-key";
import { findMemberAccessByDiscordId, findMemberAccessById } from "@/modules/members/repository/find-member-access";

import { defineModule } from "./define-module";
import { defineRoute } from "./define-route";

vi.mock("@/modules/auth/repository/validate-key", () => ({ validateKey: vi.fn() }));
vi.mock("@/modules/members/repository/find-member-access", () => ({
  findMemberAccessByDiscordId: vi.fn(),
  findMemberAccessById: vi.fn()
}));

const BOT_HEADERS = {
  authorization: "Bearer sanity_bot_secret",
  "x-discord-user-id": "123456789012345678"
};

function buildTestApp() {
  const app = Fastify();

  app.register(rateLimit, { global: false });
  app.register(
    defineModule([
      defineRoute({
        method: "GET",
        url: "/public",
        config: {
          access: "public"
        },
        handler: async () => ({ ok: true })
      }),
      defineRoute({
        method: "GET",
        url: "/guarded",
        config: {
          access: {
            role: "admin",
            clients: ["bot"]
          }
        },
        handler: async (request) => ({ memberId: request.auth.member.id.toString() })
      })
    ])
  );

  return app;
}

function buildLimitedApp() {
  const app = Fastify();

  app.register(rateLimit, {
    global: false,
    max: 2,
    timeWindow: "1 minute"
  });
  app.register(
    defineModule([
      defineRoute({
        method: "GET",
        url: "/public",
        config: {
          access: "public"
        },
        handler: async () => ({ ok: true })
      }),
      defineRoute({
        method: "GET",
        url: "/public-strict",
        config: {
          access: "public",
          rateLimit: {
            max: 1,
            timeWindow: "1 minute"
          }
        },
        handler: async () => ({ ok: true })
      }),
      defineRoute({
        method: "GET",
        url: "/guarded",
        config: {
          access: {
            role: "*",
            clients: ["bot"]
          }
        },
        handler: async () => ({ ok: true })
      })
    ])
  );

  return app;
}

async function statusCodes(app: ReturnType<typeof Fastify>, url: string, count: number) {
  const codes = [];
  for (let attempt = 0; attempt < count; attempt++) {
    const response = await app.inject({
      method: "GET",
      url,
      headers: BOT_HEADERS
    });
    codes.push(response.statusCode);
  }

  return codes;
}

describe("defineRoute guarding", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("leaves a public route open", async () => {
    const response = await buildTestApp().inject({
      method: "GET",
      url: "/public"
    });

    expect(response.statusCode).toBe(200);
    expect(validateKey).not.toHaveBeenCalled();
  });

  it("answers 401 on a guarded route with no key", async () => {
    const response = await buildTestApp().inject({
      method: "GET",
      url: "/guarded"
    });

    expect(response.statusCode).toBe(401);
  });

  it("answers 403 on a guarded route for a client it does not list", async () => {
    vi.mocked(validateKey).mockResolvedValue({
      client: "plugin",
      memberId: 1n
    });
    vi.mocked(findMemberAccessById).mockResolvedValue({
      id: 1n,
      role: "admin"
    });

    const response = await buildTestApp().inject({
      method: "GET",
      url: "/guarded",
      headers: { authorization: "Bearer sanity_plugin_secret" }
    });

    expect(response.statusCode).toBe(403);
  });

  it("answers 403 on a guarded route for a member without the role", async () => {
    vi.mocked(validateKey).mockResolvedValue({
      client: "bot",
      memberId: null
    });
    vi.mocked(findMemberAccessByDiscordId).mockResolvedValue({
      id: 1n,
      role: null
    });

    const response = await buildTestApp().inject({
      method: "GET",
      url: "/guarded",
      headers: BOT_HEADERS
    });

    expect(response.statusCode).toBe(403);
  });

  it("runs the handler as the member when the key and role are allowed", async () => {
    vi.mocked(validateKey).mockResolvedValue({
      client: "bot",
      memberId: null
    });
    vi.mocked(findMemberAccessByDiscordId).mockResolvedValue({
      id: 1n,
      role: "admin"
    });

    const response = await buildTestApp().inject({
      method: "GET",
      url: "/guarded",
      headers: BOT_HEADERS
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ memberId: "1" });
  });
});

describe("defineRoute rate limiting", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("gives a public route the default limit", async () => {
    const codes = await statusCodes(buildLimitedApp(), "/public", 3);

    expect(codes).toEqual([200, 200, 429]);
  });

  it("lets a public route set its own limit in place of the default", async () => {
    const codes = await statusCodes(buildLimitedApp(), "/public-strict", 2);

    expect(codes).toEqual([200, 429]);
  });

  it("leaves a guarded route unlimited", async () => {
    vi.mocked(validateKey).mockResolvedValue({
      client: "bot",
      memberId: null
    });
    vi.mocked(findMemberAccessByDiscordId).mockResolvedValue({
      id: 1n,
      role: null
    });

    const codes = await statusCodes(buildLimitedApp(), "/guarded", 3);

    expect(codes).toEqual([200, 200, 200]);
  });
});
