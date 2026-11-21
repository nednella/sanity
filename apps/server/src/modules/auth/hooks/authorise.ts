import type { FastifyRequest } from "fastify";

import { type ApiClient, type MemberRole, memberRole } from "@db/enums";

import { authErrors } from "@/modules/auth/errors";

export type RouteAccess =
  | "public"
  | {
      clients: ["*"] | ApiClient[];
      role?: "*" | MemberRole;
    };

// Hook is async even though it doesn't await - Fastify identifies a hook as ran
// by either a fulfilled promise, or a manual call of done().
export async function authorise(request: FastifyRequest) {
  const { access } = request.routeOptions.config;
  if (typeof access !== "object") return;

  const { client, member } = request.auth;

  // Validate that the requesting client is allowed access this route.
  const clientAllowed = access.clients.some((c) => c === "*" || c === client);
  if (!clientAllowed) throw authErrors.forbidden();

  // If the route doesn't require a role, there's nothing to authorise.
  if (access.role === undefined) return;

  // If a role is required and there's no associated member for the request,
  // then we always reject.
  if (member === undefined) throw authErrors.forbidden();

  // Else validate the requesting member has the required permissions.
  const roleAllowed = access.role === "*" || hasRole(member.role, access.role);
  if (!roleAllowed) throw authErrors.forbidden();
}

export function isRoleAbove(role: MemberRole | null, other: MemberRole | null) {
  if (role === null) return false;
  if (other === null) return true;
  return memberRole.enumValues.indexOf(role) > memberRole.enumValues.indexOf(other);
}

function hasRole(role: MemberRole | null, needed: MemberRole) {
  if (role === null) return false;
  return memberRole.enumValues.indexOf(role) >= memberRole.enumValues.indexOf(needed);
}
