import { type ChatInputCommandInteraction, TimestampStyles, time } from "discord.js";

import { api } from "@/lib/api";
import { runSubcommand } from "@/utils/commands";
import { buildEmbed } from "@/utils/embeds";
import { reply, replyError } from "@/utils/replies";

import { MENTIONED_USER_ID, NO_MEMBERS_TAGGED } from "../member/utils";

async function multiplier(interaction: ChatInputCommandInteraction) {
  const members = interaction.options.getString("members");
  const taggedDiscordIds = members?.match(MENTIONED_USER_ID) ?? [];
  if (members !== null && taggedDiscordIds.length === 0) return replyError(interaction, NO_MEMBERS_TAGGED);

  const { multipliers } = await api.post("/v1/points/multipliers", {
    body: {
      bossName: interaction.options.getString("boss"),
      days: interaction.options.getInteger("days", true),
      reason: interaction.options.getString("reason", true),
      taggedDiscordIds,
      value: interaction.options.getNumber("value", true)
    }
  });

  const { bossName, endsAt, value } = multipliers[0]!;
  const ends = time(new Date(endsAt), TimestampStyles.RelativeTime);
  return reply(
    interaction,
    buildEmbed({
      style: "success",
      title: "Point multiplier added",
      description: multipliers.map(({ member }) => member?.displayName ?? "Every member").join("\n"),
      fields: [
        { name: "Multiplier", value: `x${value}`, inline: true },
        { name: "Boss", value: bossName ?? "Every boss", inline: true },
        { name: "Ends", value: ends, inline: true }
      ]
    })
  );
}

const SUBCOMMANDS = { multiplier };

export function handlePoints(interaction: ChatInputCommandInteraction) {
  return runSubcommand(interaction, SUBCOMMANDS);
}
