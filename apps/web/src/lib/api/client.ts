import { createClient } from "@sanity/api";

import { config } from "../../../config.js";

export const api = createClient(config.apiUrl);
