import { ApplicationError } from "@/errors/error";

export const authErrors = {
  forbidden: () => new ApplicationError("FORBIDDEN", 403, "You do not have permission to do this."),
  invalidApiKey: () => new ApplicationError("INVALID_API_KEY", 401, "A valid API key is required.")
};
