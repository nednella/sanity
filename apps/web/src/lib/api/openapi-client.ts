import createFetchClient from "openapi-fetch";
import createQueryClient from "openapi-react-query";

import type { paths } from "@sanity/api/v1";

import { errorMiddleware } from "@/lib/api/middleware";

import { config } from "../../../config";

const createOpenApiClient = () => {
  const client = createFetchClient<paths>({ baseUrl: config.apiUrl });
  client.use(errorMiddleware);
  return client;
};

export const api = createQueryClient(createOpenApiClient());
