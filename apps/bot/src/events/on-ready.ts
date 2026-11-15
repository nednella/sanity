import type { Client } from "discord.js";

import { config } from "@config";

import { commands } from "@/commands";
import { channelCache } from "@/lib/channels";
import { logger } from "@/lib/logger";

export async function onReady(client: Client<true>) {
  await Promise.all([loadChannelCache(), registerCommands(client)]);
  logger.info(`Application ready! Logged in as ${client.user.tag}, ${commands.size} commands registered`);
}

async function loadChannelCache() {
  try {
    await channelCache.load();
  } catch (error) {
    logger.warn(error, "could not load the channel cache, it will load on first use");
  }
}

async function registerCommands(client: Client<true>) {
  await client.application.commands.set(commands.toJSON(), config.discordGuildId);
}
