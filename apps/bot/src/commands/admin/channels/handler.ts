import { type ChatInputCommandInteraction, type SendableChannels, channelMention, userMention } from "discord.js";

import { capitalise } from "@sanity/utils";

import { api } from "@/lib/api";
import {
  CHANNELS,
  type ChannelPurpose,
  type ChannelType,
  fetchChannels,
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

const purposeOption = (interaction: ChatInputCommandInteraction) =>
  interaction.options.getString("purpose", true) as ChannelPurpose;

const clear = async (interaction: ChatInputCommandInteraction) => {
  const purpose = purposeOption(interaction);

  await api.delete("/v1/discord/channels/{purpose}", { params: { path: { purpose } } });

  await reply(
    interaction,
    buildEmbed({
      style: "success",
      title: "Channel cleared",
      fields: [{ name: "Purpose", value: CHANNELS[purpose].label }]
    })
  );
};

const list = async (interaction: ChatInputCommandInteraction) => {
  const channels = await fetchChannels();
  const describe = (type: string) =>
    Object.entries(CHANNELS)
      .filter(([, channel]) => channel.type === type)
      .map(([purpose, { label }]) => {
        const channelId = channels.get(purpose);
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
  const purpose = purposeOption(interaction);
  const channel = interaction.options.getChannel(kind, true);

  await api.put("/v1/discord/channels/{purpose}", {
    params: { path: { purpose } },
    body: { channelId: channel.id }
  });

  await reply(
    interaction,
    buildEmbed({
      style: "success",
      title: `${capitalise(kind)} set`,
      fields: [
        { name: "Purpose", value: CHANNELS[purpose].label, inline: true },
        { name: capitalise(kind), value: channelMention(channel.id), inline: true }
      ]
    })
  );
};

const postTest = async (
  interaction: ChatInputCommandInteraction,
  purpose: ChannelPurpose,
  channel: SendableChannels
) => {
  await channel.send({
    embeds: [
      buildEmbed({
        style: "info",
        title: "Test message",
        description: `${CHANNELS[purpose].label} test from ${userMention(interaction.user.id)}.`
      })
    ]
  });

  await reply(
    interaction,
    buildEmbed({ style: "success", title: "Test sent", description: `Posted in ${channelMention(channel.id)}.` })
  );
};

const testCategory = async (interaction: ChatInputCommandInteraction) => {
  const purpose = purposeOption(interaction);
  const category = await resolveCategory(interaction.client, purpose);
  const channel = await category.children.create({ name: interaction.options.getString("name", true) });
  await postTest(interaction, purpose, channel);
};

const testText = async (interaction: ChatInputCommandInteraction) => {
  const purpose = purposeOption(interaction);
  const channel = await resolveTextChannel(interaction.client, purpose);
  await postTest(interaction, purpose, channel);
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
