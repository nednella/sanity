import { WOMClient } from "@wise-old-man/utils";

import { config } from "@config";

export const wom = new WOMClient({ apiKey: config.womApiKey, userAgent: config.womUserAgent });
