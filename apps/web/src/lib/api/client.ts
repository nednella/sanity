import { createClient } from "@sanity/api";

import { config } from "../../../config";

export const api = createClient(config.apiUrl);
