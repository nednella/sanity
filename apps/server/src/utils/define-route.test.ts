import Fastify from "fastify";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { validateApiKey } from "@/modules/auth/repository/validate-api-key";
import { findMemberAccessByDiscordId, findMemberAccessById } from "@/modules/members/repository/find-member-access";

import { defineModule } from "./define-module";
import { defineRoute } from "./define-route";

vi.mock("@/modules/auth/repository/validate-api-key", () => ({ validateApiKey: vi.fn() }));
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
    expect(validateApiKey).not.toHaveBeenCalled();
  });

  it("answers 401 on a guarded route with no key", async () => {
    const response = await buildTestApp().inject({
      method: "GET",
      url: "/guarded"
    });

    expect(response.statusCode).toBe(401);
  });

  it("answers 403 on a guarded route for a client it does not list", async () => {
    vi.mocked(validateApiKey).mockResolvedValue({
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
    vi.mocked(validateApiKey).mockResolvedValue({
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
    vi.mocked(validateApiKey).mockResolvedValue({
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
