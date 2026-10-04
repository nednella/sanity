import type { Client } from "discord.js";

import { logger } from "@/lib/logger";

export const onReady = (client: Client<true>) => {
  logger.info(`logged in as ${client.user.tag}`);
};
