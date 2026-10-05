import createFetchClient, { type Client, type Middleware } from "openapi-fetch";

import { ApiError } from "./error";
import type { paths } from "./v1";

// Throwing here rather than returning an error body means every failure a caller sees is an Error,
// whichever layer it came from.
const throwOnError: Middleware = {
  onResponse: async ({ response }) => {
    if (response.ok) return;

    throw await ApiError.from(response);
  }
};

export const createApiClient = (baseUrl: string) => {
  const client = createFetchClient<paths>({ baseUrl });
  client.use(throwOnError);
  return client;
};

export type ApiClient = Client<paths>;
