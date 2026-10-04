import { createApiClient } from "@sanity/api";

import { config } from "@config";

export const api = createApiClient(config.apiUrl);
