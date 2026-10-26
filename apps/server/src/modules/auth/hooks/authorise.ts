import type { FastifyRequest } from "fastify";

import { type ApiClient, type MemberRole, memberRole } from "@db/enums";

import { authErrors } from "../errors";

export type RouteAccess =
  | "public"
  | {
      role: MemberRole | "*";
      clients: ApiClient[] | ["*"];
    };

// Hook is async even though it doesn't await - Fastify identifies a hook as ran
// by either a fulfilled promise, or a manual call of done().
export async function authorise(request: FastifyRequest) {
  const { access } = request.routeOptions.config;
  if (typeof access !== "object") return;

  const { client, member } = request.auth;
  const roleAllowed = access.role === "*" || hasRole(member.role, access.role);
  if (!roleAllowed) throw authErrors.forbidden();

  const clientAllowed = access.clients.some((c) => c === "*" || c === client);
  if (!clientAllowed) throw authErrors.forbidden();
}

function hasRole(role: MemberRole | null, needed: MemberRole) {
  if (role === null) return false;
  return memberRole.enumValues.indexOf(role) >= memberRole.enumValues.indexOf(needed);
}
