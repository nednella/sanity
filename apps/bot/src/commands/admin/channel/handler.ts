import { type ChatInputCommandInteraction, channelMention } from "discord.js";

import { api } from "@/lib/api";
import { CHANNELS, type ChannelPurpose, type ChannelType, fetchChannels } from "@/lib/channels";
import { brandEmbed, successEmbed } from "@/utils/embeds";
import { capitalise } from "@/utils/format";
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

  await api.delete("/v1/admin/discord/channels/{purpose}", {
    params: { path: { purpose } },
    body: { actingDiscordId: interaction.user.id }
  });

  await reply(
    interaction,
    successEmbed({
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
    brandEmbed({
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

  await api.put("/v1/admin/discord/channels/{purpose}", {
    params: { path: { purpose } },
    body: { actingDiscordId: interaction.user.id, channelId: channel.id }
  });

  await reply(
    interaction,
    successEmbed({
      title: `${capitalise(kind)} set`,
      fields: [
        { name: "Purpose", value: CHANNELS[purpose].label, inline: true },
        { name: capitalise(kind), value: channelMention(channel.id), inline: true }
      ]
    })
  );
};

const SUBCOMMANDS = {
  clear,
  list,
  "set category": set,
  "set text": set
} satisfies Record<string, (interaction: ChatInputCommandInteraction) => Promise<void>>;

export const handleChannel = (interaction: ChatInputCommandInteraction) => {
  const name = [interaction.options.getSubcommandGroup(), interaction.options.getSubcommand(true)]
    .filter(Boolean)
    .join(" ") as keyof typeof SUBCOMMANDS;
  return SUBCOMMANDS[name](interaction);
};
