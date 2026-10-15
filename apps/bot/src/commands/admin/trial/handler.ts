import { type ChatInputCommandInteraction, GuildMember, userMention } from "discord.js";

import { api } from "@/lib/api";
import { brandEmbed } from "@/utils/embeds";
import { reply } from "@/utils/replies";

export const handleTrial = async (interaction: ChatInputCommandInteraction) => {
  const user = interaction.options.getUser("member", true);
  const member = interaction.options.getMember("member");

  const { results } = await api.post("/v1/admin/members/trial", {
    body: {
      actingDiscordId: interaction.user.id,
      trialists: [
        {
          altRsn: interaction.options.getString("alt_rsn"),
          discordId: user.id,
          displayName: member instanceof GuildMember ? member.displayName : user.displayName,
          mainRsn: interaction.options.getString("main_rsn", true)
        }
      ]
    }
  });
  const [result] = results;

  await reply(
    interaction,
    brandEmbed({
      tone: "success",
      title: "Trial",
      description:
        result?.outcome === "retrialling"
          ? `${userMention(user.id)} is trialling again, with ${result.pointsCleared} points cleared`
          : `${userMention(user.id)} is now trialling`
    })
  );
};
