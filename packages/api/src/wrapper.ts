import type { ClientPathsWithMethod, MaybeOptionalInit, MethodResponse, Middleware } from "openapi-fetch";
import type { HttpMethod, RequiredKeysOf } from "openapi-typescript-helpers";

import { type ApiClient, createApiClient } from "./client";
import { NetworkError } from "./error";
import type { paths } from "./v1";

const DEFAULT_TIMEOUT_MS = 10_000;

type Init<I> = RequiredKeysOf<I> extends never ? [I?] : [I];

type ApiOptions = { timeoutMs?: number };

const timeout = (ms: number): Middleware => ({
  onRequest: ({ request }) => new Request(request, { signal: AbortSignal.timeout(ms) })
});

const unavailable: Middleware = {
  onError: ({ error }) => new NetworkError(error)
};

// Failures throw, so a call that returns always has data. The raw client still types it as optional.
const unwrapped =
  <M extends HttpMethod>(client: ApiClient, method: M) =>
  async <P extends ClientPathsWithMethod<ApiClient, M>, I extends MaybeOptionalInit<paths[P], M>>(
    url: P,
    ...init: Init<I>
  ) => {
    const { data } = await client.request(method, url, ...(init as unknown as never[]));
    return data as MethodResponse<ApiClient, M, P, I>;
  };

// For callers without a UI of their own, such as the bot: every call either returns data or throws,
// and a server that never answers is told apart from one that answered with an error.
export const createWrappedApiClient = (baseUrl: string, { timeoutMs = DEFAULT_TIMEOUT_MS }: ApiOptions = {}) => {
  const client = createApiClient(baseUrl);
  client.use(timeout(timeoutMs), unavailable);

  return {
    delete: unwrapped(client, "delete"),
    get: unwrapped(client, "get"),
    patch: unwrapped(client, "patch"),
    post: unwrapped(client, "post")
  };
};

export type WrappedApiClient = ReturnType<typeof createWrappedApiClient>;
