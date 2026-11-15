import type {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageActionRowComponentBuilder
} from "discord.js";

import { buildEmbed } from "./embeds";

type ReplyOptions = { components?: ActionRowBuilder<MessageActionRowComponentBuilder>[] };

// Every command is deferred before it runs, so a reply is always an edit of that deferral.
export function reply(
  interaction: ChatInputCommandInteraction,
  embed: EmbedBuilder,
  { components }: ReplyOptions = {}
) {
  return interaction.editReply({ embeds: [embed], components });
}

export function replyError(
  interaction: ChatInputCommandInteraction,
  { title, description }: { title: string; description: string }
) {
  return reply(interaction, buildEmbed({ description, style: "error", title }));
}

export function replyNotImplemented(interaction: ChatInputCommandInteraction) {
  return reply(
    interaction,
    buildEmbed({
      description: `\`/${interaction.commandName}\` is not implemented yet.`,
      style: "warning",
      title: "Not implemented"
    })
  );
}
