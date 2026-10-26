import { ApplicationError } from "@/errors/error";

export const authErrors = {
  apiKeyNotFound: (id: number) =>
    new ApplicationError("API_KEY_NOT_FOUND", 404, `Key #${id} is not found or already revoked.`),
  forbidden: () => new ApplicationError("FORBIDDEN", 403, "You do not have permission to do this."),
  invalidApiKey: () => new ApplicationError("INVALID_API_KEY", 401, "A valid API key is required.")
};
