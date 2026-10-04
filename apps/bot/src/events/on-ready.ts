import type { Client } from "discord.js";

import { config } from "@config";

import { commands } from "@/commands";
import { logger } from "@/lib/logger";

export const onReady = async (client: Client<true>) => {
  await client.application.commands.set(commands.toJSON(), config.discordGuildId);
  logger.info(`Application ready! Logged in as ${client.user.tag}, ${commands.size} commands registered`);
};
