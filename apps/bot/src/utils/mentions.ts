import { type ChatInputCommandInteraction, chatInputApplicationCommandMention, inlineCode } from "discord.js";

import type { Command } from "@/types";

// A mention is clickable, but it needs the id Discord assigned on registration.
export const commandMention = (interaction: ChatInputCommandInteraction, command: Command) => {
  const registered = interaction.client.application.commands.cache.find((entry) => entry.name === command.name);
  return registered ? chatInputApplicationCommandMention(command.name, registered.id) : inlineCode(`/${command.name}`);
};
