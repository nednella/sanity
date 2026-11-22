import cookie from "@fastify/cookie";
import rateLimit from "@fastify/rate-limit";
import Fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { authModule } from "./router";
import { loginWithDiscord } from "./service/login-with-discord";
import { OAUTH_REDIRECT_COOKIE_NAME, OAUTH_STATE_COOKIE_NAME } from "./utils/cookies";

vi.mock("@config", () => ({
  config: {
    databaseUrl: "postgres://localhost/test",
    discordClientId: "client",
    discordRedirectUri: "http://api.test/v1/auth/discord/callback",
    webUrl: "http://web.test"
  }
}));
vi.mock("./service/login-with-discord", () => ({ loginWithDiscord: vi.fn() }));

const STATE = "state";

function buildTestApp() {
  const app = Fastify();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.register(cookie);
  app.register(rateLimit, { global: false });
  app.register(authModule);

  return app;
}

function returnFromDiscord(query: string, redirect?: string) {
  const cookies: Record<string, string> = { [OAUTH_STATE_COOKIE_NAME]: STATE };
  if (redirect !== undefined) cookies[OAUTH_REDIRECT_COOKIE_NAME] = redirect;

  return buildTestApp().inject({
    method: "GET",
    url: `/auth/discord/callback?state=${STATE}&${query}`,
    cookies
  });
}

describe("GET /auth/discord", () => {
  it("keeps the page to return to in a cookie", async () => {
    const response = await buildTestApp().inject({
      method: "GET",
      url: `/auth/discord?redirect=${encodeURIComponent("/members/182?tab=pbs")}`
    });

    expect(response.statusCode).toBe(302);
    expect(response.cookies).toContainEqual(
      expect.objectContaining({
        name: OAUTH_REDIRECT_COOKIE_NAME,
        value: "/members/182?tab=pbs"
      })
    );
  });

  it("returns to the root when no page is given", async () => {
    const response = await buildTestApp().inject({
      method: "GET",
      url: "/auth/discord"
    });

    expect(response.cookies).toContainEqual(
      expect.objectContaining({
        name: OAUTH_REDIRECT_COOKIE_NAME,
        value: "/"
      })
    );
  });
});

describe("GET /auth/discord/callback", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(loginWithDiscord).mockResolvedValue("secret");
  });

  it("returns to the page the login started from", async () => {
    const response = await returnFromDiscord("code=code", "/members/182?tab=pbs");

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe("http://web.test/members/182?tab=pbs");
  });

  it("returns to the root when the redirect cookie has expired", async () => {
    const response = await returnFromDiscord("code=code");

    expect(response.headers.location).toBe("http://web.test/");
  });

  it.each(["https://evil.example/login", "//evil.example", String.raw`/\evil.example`, "http://web.test.evil.example"])(
    "returns to the root instead of %s",
    async (redirect) => {
      const response = await returnFromDiscord("code=code", redirect);

      expect(response.headers.location).toBe("http://web.test/");
    }
  );

  it("adds the error to the page the login started from", async () => {
    const response = await returnFromDiscord("error=access_denied", "/members/182?tab=pbs");

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe("http://web.test/members/182?tab=pbs&auth=failed&error=ACCESS_DENIED");
  });

  it("clears the redirect cookie", async () => {
    const response = await returnFromDiscord("code=code", "/members");

    expect(response.cookies).toContainEqual(
      expect.objectContaining({
        name: OAUTH_REDIRECT_COOKIE_NAME,
        value: ""
      })
    );
  });
});
