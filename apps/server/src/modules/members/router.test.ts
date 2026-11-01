import rateLimit from "@fastify/rate-limit";
import Fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { MemberRole } from "@db/enums";

import { validateKey } from "@/modules/auth/repository/validate-key";

import { findMemberAccessByDiscordId } from "./repository/find-member-access";
import { membersModule } from "./router";
import { changeMemberRoles } from "./service/change-member-roles";

vi.mock("@config", () => ({ config: { databaseUrl: "postgres://localhost/test" } }));
vi.mock("@/modules/auth/repository/validate-key", () => ({ validateKey: vi.fn() }));
vi.mock("./repository/find-member-access", () => ({
  findMemberAccessByDiscordId: vi.fn(),
  findMemberAccessById: vi.fn()
}));
vi.mock("./service/change-member-roles", () => ({ changeMemberRoles: vi.fn() }));

const BOT_HEADERS = {
  authorization: "Bearer sanity_bot_secret",
  "x-discord-user-id": "123456789012345678"
};

const MEMBERS = [{ discordId: "223456789012345678" }];

function buildTestApp() {
  const app = Fastify();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.register(rateLimit, { global: false });
  app.register(membersModule);

  return app;
}

async function sendAs(role: MemberRole, method: "DELETE" | "POST", url: string, payload: object) {
  vi.mocked(validateKey).mockResolvedValue({
    client: "bot",
    memberId: null
  });
  vi.mocked(findMemberAccessByDiscordId).mockResolvedValue({
    id: 1n,
    role
  });
  vi.mocked(changeMemberRoles).mockResolvedValue({
    changed: [],
    skipped: []
  });

  return buildTestApp().inject({
    method,
    url,
    headers: BOT_HEADERS,
    payload
  });
}

describe("DELETE /members/admin", () => {
  const payload = { members: MEMBERS };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("forbids an admin", async () => {
    const response = await sendAs("admin", "DELETE", "/members/admin", payload);

    expect(response.statusCode).toBe(403);
    expect(changeMemberRoles).not.toHaveBeenCalled();
  });

  it("lets a superuser remove roles", async () => {
    const response = await sendAs("superuser", "DELETE", "/members/admin", payload);

    expect(response.statusCode).toBe(200);
    expect(changeMemberRoles).toHaveBeenCalled();
  });
});

describe("POST /members/admin", () => {
  const payload = {
    members: MEMBERS,
    role: "admin"
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("forbids an admin", async () => {
    const response = await sendAs("admin", "POST", "/members/admin", payload);

    expect(response.statusCode).toBe(403);
    expect(changeMemberRoles).not.toHaveBeenCalled();
  });

  it("lets a superuser give admin", async () => {
    const response = await sendAs("superuser", "POST", "/members/admin", payload);

    expect(response.statusCode).toBe(200);
    expect(changeMemberRoles).toHaveBeenCalled();
  });
});

describe("POST /members/role", () => {
  const payload = {
    members: MEMBERS,
    role: "reviewer"
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("forbids a reviewer", async () => {
    const response = await sendAs("reviewer", "POST", "/members/role", payload);

    expect(response.statusCode).toBe(403);
    expect(changeMemberRoles).not.toHaveBeenCalled();
  });

  it("lets an admin give reviewer", async () => {
    const response = await sendAs("admin", "POST", "/members/role", payload);

    expect(response.statusCode).toBe(200);
    expect(changeMemberRoles).toHaveBeenCalled();
  });
});

describe("DELETE /members/role", () => {
  const payload = { members: MEMBERS };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("forbids a reviewer", async () => {
    const response = await sendAs("reviewer", "DELETE", "/members/role", payload);

    expect(response.statusCode).toBe(403);
    expect(changeMemberRoles).not.toHaveBeenCalled();
  });

  it("lets an admin remove roles", async () => {
    const response = await sendAs("admin", "DELETE", "/members/role", payload);

    expect(response.statusCode).toBe(200);
    expect(changeMemberRoles).toHaveBeenCalled();
  });
});
