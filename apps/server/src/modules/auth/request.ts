import { z } from "zod";

export const apiKeyParams = z.object({ id: z.coerce.number().int().positive() });

// https://www.rfc-editor.org/rfc/rfc6749#section-4.1.2.1
export const authorizationErrorCode = z.enum([
  "access_denied",
  "invalid_request",
  "invalid_scope",
  "server_error",
  "temporarily_unavailable",
  "unauthorized_client",
  "unsupported_response_type"
]);

export const authorizationResponseQuery = z.object({
  error: authorizationErrorCode.optional(),
  state: z.string()
});

export type AuthorizationErrorCode = z.infer<typeof authorizationErrorCode>;
