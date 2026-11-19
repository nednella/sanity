import createQueryClient from "openapi-react-query";

import { createApiClient } from "@sanity/api";

import { config } from "@config";

import { networkErrorMiddleware } from "@/lib/api/middleware";

export const api = createQueryClient(createClient());

function createClient() {
  // The API is on another origin, so the session cookie needs "include".
  const client = createApiClient(config.apiUrl, "include");
  client.use(networkErrorMiddleware);
  return client;
}
