import type { FastifyRequest } from "fastify";
import { describe, expect, it } from "vitest";

import type { ApiClient, MemberRole } from "@db/enums";

import { type RouteAccess, authorise, isRoleAbove } from "./authorise";

function requestWith(access: RouteAccess, client: ApiClient, role: MemberRole | null) {
  return {
    routeOptions: { config: { access } },
    auth: {
      client,
      member: {
        id: 1n,
        role
      }
    }
  } as unknown as FastifyRequest;
}

describe("authorise", () => {
  it("allows any client and role on a route open to all", async () => {
    const access: RouteAccess = {
      role: "*",
      clients: ["*"]
    };

    await expect(authorise(requestWith(access, "plugin", null))).resolves.toBeUndefined();
  });

  it("allows a member with the needed role", async () => {
    const access: RouteAccess = {
      role: "admin",
      clients: ["bot"]
    };

    await expect(authorise(requestWith(access, "bot", "admin"))).resolves.toBeUndefined();
  });

  it("allows a member with a higher role than needed", async () => {
    const access: RouteAccess = {
      role: "admin",
      clients: ["bot"]
    };

    await expect(authorise(requestWith(access, "bot", "superuser"))).resolves.toBeUndefined();
  });

  it("forbids a member with no role", async () => {
    const access: RouteAccess = {
      role: "admin",
      clients: ["bot"]
    };

    await expect(authorise(requestWith(access, "bot", null))).rejects.toMatchObject({ statusCode: 403 });
  });

  it("forbids a member with a lower role than needed", async () => {
    const access: RouteAccess = {
      role: "superuser",
      clients: ["bot"]
    };

    await expect(authorise(requestWith(access, "bot", "admin"))).rejects.toMatchObject({ statusCode: 403 });
  });

  it("forbids a reviewer on an admin route", async () => {
    const access: RouteAccess = {
      role: "admin",
      clients: ["bot"]
    };

    await expect(authorise(requestWith(access, "bot", "reviewer"))).rejects.toMatchObject({ statusCode: 403 });
  });

  it("forbids a client the route does not list", async () => {
    const access: RouteAccess = {
      role: "*",
      clients: ["bot"]
    };

    await expect(authorise(requestWith(access, "plugin", "superuser"))).rejects.toMatchObject({ statusCode: 403 });
  });
});

describe("isRoleAbove", () => {
  it("puts a role above a lower role and above no role", () => {
    expect(isRoleAbove("superuser", "admin")).toBe(true);
    expect(isRoleAbove("admin", "reviewer")).toBe(true);
    expect(isRoleAbove("reviewer", null)).toBe(true);
  });

  it("does not put a role above itself or a higher role", () => {
    expect(isRoleAbove("admin", "admin")).toBe(false);
    expect(isRoleAbove("admin", "superuser")).toBe(false);
    expect(isRoleAbove(null, null)).toBe(false);
  });
});
