import { type ChatInputCommandInteraction, type SendableChannels, channelMention, userMention } from "discord.js";

import { capitalise } from "@sanity/utils";

import { api } from "@/lib/api";
import {
  CHANNELS,
  type ChannelIntent,
  type ChannelType,
  channelCache,
  resolveCategory,
  resolveTextChannel
} from "@/lib/channels";
import { runSubcommand } from "@/utils/commands";
import { buildEmbed } from "@/utils/embeds";
import { reply } from "@/utils/replies";

const GROUPS: Record<ChannelType, string> = {
  text: "Text channels",
  voice: "Voice channels",
  category: "Categories"
};

const intentOption = (interaction: ChatInputCommandInteraction) =>
  interaction.options.getString("purpose", true) as ChannelIntent;

const clear = async (interaction: ChatInputCommandInteraction) => {
  const intent = intentOption(interaction);

  await api.delete("/v1/discord/channels/{purpose}", { params: { path: { purpose: intent } } });
  channelCache.clearChannel(intent);

  await reply(
    interaction,
    buildEmbed({
      style: "success",
      title: "Channel cleared",
      fields: [{ name: "Purpose", value: CHANNELS[intent].label }]
    })
  );
};

const list = async (interaction: ChatInputCommandInteraction) => {
  const channels = await channelCache.channels();
  const describe = (type: string) =>
    Object.entries(CHANNELS)
      .filter(([, channel]) => channel.type === type)
      .map(([intent, { label }]) => {
        const channelId = channels.get(intent);
        return `${label} · ${channelId ? channelMention(channelId) : "not set"}`;
      })
      .join("\n");

  await reply(
    interaction,
    buildEmbed({
      title: "Connected Channels",
      fields: Object.entries(GROUPS)
        .map(([type, name]) => ({ name, value: describe(type) }))
        .filter((field) => field.value)
    })
  );
};

const set = async (interaction: ChatInputCommandInteraction) => {
  const kind = interaction.options.getSubcommand(true) === "text" ? "channel" : "category";
  const intent = intentOption(interaction);
  const channel = interaction.options.getChannel(kind, true);

  await api.put("/v1/discord/channels/{purpose}", {
    params: { path: { purpose: intent } },
    body: { channelId: channel.id }
  });
  channelCache.setChannel(intent, channel.id);

  await reply(
    interaction,
    buildEmbed({
      style: "success",
      title: `${capitalise(kind)} set`,
      fields: [
        { name: "Purpose", value: CHANNELS[intent].label, inline: true },
        { name: capitalise(kind), value: channelMention(channel.id), inline: true }
      ]
    })
  );
};

const postTest = async (interaction: ChatInputCommandInteraction, intent: ChannelIntent, channel: SendableChannels) => {
  await channel.send({
    embeds: [
      buildEmbed({
        style: "info",
        title: "Test message",
        description: `${CHANNELS[intent].label} test from ${userMention(interaction.user.id)}.`
      })
    ]
  });

  await reply(
    interaction,
    buildEmbed({ style: "success", title: "Test sent", description: `Posted in ${channelMention(channel.id)}.` })
  );
};

const testCategory = async (interaction: ChatInputCommandInteraction) => {
  const intent = intentOption(interaction);
  const category = await resolveCategory(interaction.client, intent);
  const channel = await category.children.create({ name: interaction.options.getString("name", true) });
  await postTest(interaction, intent, channel);
};

const testText = async (interaction: ChatInputCommandInteraction) => {
  const intent = intentOption(interaction);
  const channel = await resolveTextChannel(interaction.client, intent);
  await postTest(interaction, intent, channel);
};

const SUBCOMMANDS = {
  clear,
  list,
  "set category": set,
  "set text": set,
  "test category": testCategory,
  "test text": testText
} satisfies Record<string, (interaction: ChatInputCommandInteraction) => Promise<void>>;

export const handleChannels = (interaction: ChatInputCommandInteraction) => runSubcommand(interaction, SUBCOMMANDS);
