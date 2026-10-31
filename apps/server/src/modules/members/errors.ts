import { ApplicationError } from "@/errors/error";

export const memberErrors = {
  alreadyAdmin: () => new ApplicationError("MEMBER_ALREADY_ADMIN", 409, "is already an admin"),
  alreadyQuit: () => new ApplicationError("MEMBER_ALREADY_QUIT", 409, "has already quit the clan"),
  alreadyRank: () => new ApplicationError("MEMBER_ALREADY_RANK", 409, "already has that rank"),
  alreadyRetired: () => new ApplicationError("MEMBER_ALREADY_RETIRED", 409, "is already retired"),
  hasPluginAccess: () => new ApplicationError("MEMBER_HAS_PLUGIN_ACCESS", 409, "already has plugin access"),
  hasQuit: () => new ApplicationError("MEMBER_HAS_QUIT", 409, "has quit the clan"),
  isSuperuser: () => new ApplicationError("MEMBER_IS_SUPERUSER", 409, "is a superuser, so their role cannot change"),
  noRankEarned: () => new ApplicationError("MEMBER_NO_RANK_EARNED", 409, "has not earned a rank"),
  noRankToGive: () => new ApplicationError("NO_RANK_TO_GIVE", 409, "No active rank exists to pass a trialist into."),
  notAdmin: () => new ApplicationError("MEMBER_NOT_ADMIN", 409, "is not an admin"),
  notFound: (id: bigint) => new ApplicationError("MEMBER_NOT_FOUND", 404, `ID ${id} is not found.`),
  notRetired: () => new ApplicationError("MEMBER_NOT_RETIRED", 409, "is not retired"),
  notTrialist: () => new ApplicationError("MEMBER_NOT_TRIALIST", 409, "is not a trialist"),
  pluginAccessRevoked: () => new ApplicationError("MEMBER_PLUGIN_ACCESS_REVOKED", 409, "already has no plugin access"),
  unknownRank: (rankId: number) => new ApplicationError("RANK_NOT_FOUND", 404, `Rank ${rankId} is not found.`)
};
