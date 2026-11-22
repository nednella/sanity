import { ApplicationError } from "@/errors/error";
import type { AuthorizationErrorCode } from "@/modules/auth/request";

export const authErrors = {
  apiKeyNotFound: (id: number) =>
    new ApplicationError("API_KEY_NOT_FOUND", 404, `Key #${id} is not found or already revoked.`),
  authorizationError: (error: AuthorizationErrorCode) =>
    new ApplicationError(error.toUpperCase(), 401, `The authorization server answered with "${error}".`),
  forbidden: () => new ApplicationError("FORBIDDEN", 403, "You do not have permission to do this."),
  invalidApiKey: () => new ApplicationError("INVALID_API_KEY", 401, "A valid API key is required."),
  invalidSession: () => new ApplicationError("INVALID_SESSION", 401, "A valid session is required."),
  loginFailed: () => new ApplicationError("LOGIN_FAILED", 401, "The login attempt could not be completed."),
  notAMember: () => new ApplicationError("NOT_A_MEMBER", 403, "Only active clan members can login."),
  pluginAccessRevoked: () =>
    new ApplicationError("PLUGIN_ACCESS_REVOKED", 403, "An admin has revoked your access to the plugin.")
};
