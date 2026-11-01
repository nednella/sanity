import type { MemberRole } from "@db/enums";

import { ApplicationError } from "@/errors/error";

export const memberErrors = {
  alreadyHasRole: (role: MemberRole) =>
    new ApplicationError("MEMBER_ALREADY_HAS_ROLE", 409, `already has the ${role} role`),
  alreadyQuit: () => new ApplicationError("MEMBER_ALREADY_QUIT", 409, "has already quit the clan"),
  alreadyRank: () => new ApplicationError("MEMBER_ALREADY_RANK", 409, "already has that rank"),
  alreadyRetired: () => new ApplicationError("MEMBER_ALREADY_RETIRED", 409, "is already retired"),
  hasNoRole: () => new ApplicationError("MEMBER_HAS_NO_ROLE", 409, "has no role"),
  hasPluginAccess: () => new ApplicationError("MEMBER_HAS_PLUGIN_ACCESS", 409, "already has plugin access"),
  hasQuit: () => new ApplicationError("MEMBER_HAS_QUIT", 409, "has quit the clan"),
  noRankEarned: () => new ApplicationError("MEMBER_NO_RANK_EARNED", 409, "has not earned a rank"),
  noRankToGive: () => new ApplicationError("NO_RANK_TO_GIVE", 409, "No active rank exists to pass a trialist into."),
  notFound: (id: bigint) => new ApplicationError("MEMBER_NOT_FOUND", 404, `ID ${id} is not found.`),
  notRetired: () => new ApplicationError("MEMBER_NOT_RETIRED", 409, "is not retired"),
  notTrialist: () => new ApplicationError("MEMBER_NOT_TRIALIST", 409, "is not a trialist"),
  pluginAccessRevoked: () => new ApplicationError("MEMBER_PLUGIN_ACCESS_REVOKED", 409, "already has no plugin access"),
  roleTooHigh: () => new ApplicationError("MEMBER_ROLE_TOO_HIGH", 409, "has a role you cannot change"),
  unknownRank: (rankId: number) => new ApplicationError("RANK_NOT_FOUND", 404, `Rank ${rankId} is not found.`)
};
