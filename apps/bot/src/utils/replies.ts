import type {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageActionRowComponentBuilder
} from "discord.js";

import { buildEmbed } from "./embeds";

type ReplyOptions = { components?: ActionRowBuilder<MessageActionRowComponentBuilder>[] };

// Every command is deferred before it runs, so a reply is always an edit of that deferral.
export const reply = (
  interaction: ChatInputCommandInteraction,
  embed: EmbedBuilder,
  { components }: ReplyOptions = {}
) => interaction.editReply({ embeds: [embed], components });

export const replyError = (
  interaction: ChatInputCommandInteraction,
  { title, description }: { title: string; description: string }
) => reply(interaction, buildEmbed({ description, style: "error", title }));

export const replyNotImplemented = (interaction: ChatInputCommandInteraction) =>
  reply(
    interaction,
    buildEmbed({
      description: `\`/${interaction.commandName}\` is not implemented yet.`,
      style: "warning",
      title: "Not implemented"
    })
  );
