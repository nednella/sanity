import createQueryClient from "openapi-react-query";

import { createApiClient } from "@sanity/api";

import { config } from "@config";

import { networkErrorMiddleware } from "@/lib/api/middleware";

const createClient = () => {
  const client = createApiClient(config.apiUrl);
  client.use(networkErrorMiddleware);
  return client;
};

export const api = createQueryClient(createClient());
