import { createWrappedApiClient } from "@sanity/api";

import { config } from "@config";

export const api = createWrappedApiClient(config.apiUrl);
