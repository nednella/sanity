import { type ChatInputCommandInteraction, chatInputApplicationCommandMention, inlineCode } from "discord.js";

import type { Command } from "@/types";

// A mention is clickable, but it needs the id Discord assigned on registration.
export const commandMention = (interaction: ChatInputCommandInteraction, command: Command, subcommand?: string) => {
  const registered = interaction.client.application.commands.cache.find((entry) => entry.name === command.name);
  const name = subcommand ? `${command.name} ${subcommand}` : command.name;
  return registered ? chatInputApplicationCommandMention(name, registered.id) : inlineCode(`/${name}`);
};
