import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  type ButtonBuilder,
  type ChatInputCommandInteraction
} from "discord.js";

import { SANITY_TEMPLE_URL, SANITY_WOM_URL, SANITY_X_URL } from "@sanity/urls";

import { config } from "@config";

import { commands } from "@/commands";
import type { Category, Command } from "@/types";
import { linkButton } from "@/utils/buttons";
import { LIST_SEPARATOR, buildEmbed } from "@/utils/embeds";
import { commandMention } from "@/utils/mentions";
import { reply } from "@/utils/replies";

const EMBED_DESCRIPTION = "Can you help me box, what's the command?";
const GETTING_STARTED =
  "My commands are available with the `/` prefix. Some commands are channel restricted, and the commands themselves redirect you if needed.\n\n";

const links = new ActionRowBuilder<ButtonBuilder>().addComponents(
  linkButton("Website", config.webUrl),
  linkButton("X", SANITY_X_URL),
  linkButton("Temple", SANITY_TEMPLE_URL),
  linkButton("WOM", SANITY_WOM_URL)
);

export function handleAdminHelp(interaction: ChatInputCommandInteraction) {
  return reply(
    interaction,
    buildEmbed({
      description: EMBED_DESCRIPTION,
      fields: filteredSections(interaction, true),
      thumbnail: interaction.client.user.displayAvatarURL()
    })
  );
}

export function handleHelp(interaction: ChatInputCommandInteraction) {
  return reply(
    interaction,
    buildEmbed({
      description: EMBED_DESCRIPTION,
      fields: [{ name: "Getting Started", value: GETTING_STARTED }, ...filteredSections(interaction, false)],
      thumbnail: interaction.client.user.displayAvatarURL()
    }),
    { components: [links] }
  );
}

function byCategory(a: Category, b: Category) {
  if (a === "Mainframe" || b === "Misc") return -1;
  if (a === "Misc" || b === "Mainframe") return 1;
  return a.localeCompare(b);
}

function filteredSections(interaction: ChatInputCommandInteraction, isAdmin: boolean) {
  const filteredCommands = commands
    // Filter admin commands & filter the calling command (/help)
    .filter((command) => command.admin === isAdmin && command.name !== interaction.commandName)
    // Sort alphabetically
    .sorted((a, b) => a.name.localeCompare(b.name));

  // Group and display commands by category
  return [...Map.groupBy(filteredCommands.values(), (command) => command.category)]
    .toSorted(([a], [b]) => byCategory(a, b))
    .map(([category, grouped]) => ({
      name: category,
      value: grouped.flatMap((command) => describeCommand(interaction, command)).join("\n")
    }));
}

// A command with subcommands can only be run through one of them, so each gets
// its own line.
function describeCommand(interaction: ChatInputCommandInteraction, command: Command) {
  const subcommands = (command.toJSON().options ?? [])
    .flatMap((option) => {
      if (option.type === ApplicationCommandOptionType.Subcommand) return [option];
      if (option.type !== ApplicationCommandOptionType.SubcommandGroup) return [];
      return (option.options ?? []).map((subcommand) => ({ ...subcommand, name: `${option.name} ${subcommand.name}` }));
    })
    .toSorted((a, b) => a.name.localeCompare(b.name));
  if (subcommands.length === 0) {
    return [`${commandMention(interaction, command)}${LIST_SEPARATOR}${command.description}`];
  }
  return subcommands.map(
    (subcommand) => `${commandMention(interaction, command, subcommand.name)}${LIST_SEPARATOR}${subcommand.description}`
  );
}
