import { ActionRowBuilder, ButtonBuilder, ButtonStyle, type ChatInputCommandInteraction } from "discord.js";

import { SANITY_TEMPLE_URL, SANITY_WOM_URL, SANITY_X_URL } from "@sanity/urls";

import { config } from "@config";

import { commands } from "@/commands";
import { brandEmbed } from "@/utils/embeds";
import { commandMention } from "@/utils/mentions";
import { reply } from "@/utils/replies";

const GETTING_STARTED = [
  "My commands are available with the `/` prefix. Some commands are channel restricted, and the commands themselves redirect you if needed.\n\n"
].join("");

export const handleHelp = (interaction: ChatInputCommandInteraction) =>
  reply(
    interaction,
    brandEmbed({
      description: "Can you help me box, what's the command?",
      fields: [{ name: "Getting Started", value: GETTING_STARTED }, ...filteredSections(interaction, false)],
      thumbnail: interaction.client.user.displayAvatarURL()
    }),
    { components: [links] }
  );

export const handleAdminHelp = (interaction: ChatInputCommandInteraction) =>
  reply(
    interaction,
    brandEmbed({
      description: "Can you help me box, what's the command?",
      fields: filteredSections(interaction, true),
      thumbnail: interaction.client.user.displayAvatarURL()
    })
  );

const filteredSections = (interaction: ChatInputCommandInteraction, isAdmin: boolean) => {
  const filteredCommands = commands
    // Filter admin commands & filter the calling command (/help)
    .filter((command) => command.admin === isAdmin && command.name !== interaction.commandName)
    // Sort alphabetically
    .sorted((a, b) => a.name.localeCompare(b.name));

  // Group and display commands by category
  return [...Map.groupBy(filteredCommands.values(), (command) => command.category)]
    .toSorted(([a], [b]) => a.localeCompare(b))
    .map(([category, grouped]) => ({
      name: category,
      value: grouped.map((command) => `${commandMention(interaction, command)} · ${command.description}`).join("\n")
    }));
};

const links = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder().setLabel("Website").setStyle(ButtonStyle.Link).setURL(config.webUrl),
  new ButtonBuilder().setLabel("X").setStyle(ButtonStyle.Link).setURL(SANITY_X_URL),
  new ButtonBuilder().setLabel("Temple").setStyle(ButtonStyle.Link).setURL(SANITY_TEMPLE_URL),
  new ButtonBuilder().setLabel("WOM").setStyle(ButtonStyle.Link).setURL(SANITY_WOM_URL)
);
