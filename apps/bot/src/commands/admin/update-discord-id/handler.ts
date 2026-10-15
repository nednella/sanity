import { type ChatInputCommandInteraction, userMention } from "discord.js";

import { api } from "@/lib/api";
import { brandEmbed } from "@/utils/embeds";
import { reply } from "@/utils/replies";

export const handleUpdateDiscordId = async (interaction: ChatInputCommandInteraction) => {
  const name = interaction.options.getString("name", true);
  const account = interaction.options.getUser("account", true);

  const { member, outcome } = await api.post("/v1/admin/discord/update-account", {
    body: {
      account: {
        avatarHash: account.avatar,
        discordId: account.id
      },
      actingDiscordId: interaction.user.id,
      displayName: name
    }
  });

  const mention = userMention(account.id);
  const outcomes = {
    "discord-account-changed": { tone: "success", description: `${member?.displayName} now uses ${mention}` },
    "discord-id-taken": { tone: "error", description: `${mention} already belongs to another member` },
    "non-unique-display-name": { tone: "error", description: `More than one member is named ${name}` },
    "not-a-member": { tone: "error", description: `No member is named ${name}` },
    unchanged: { tone: "warning", description: `${member?.displayName} already uses ${mention}` }
  } as const;

  await reply(interaction, brandEmbed({ title: "Update Discord ID", ...outcomes[outcome] }));
};
