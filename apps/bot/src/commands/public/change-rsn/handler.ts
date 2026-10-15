import { type ChatInputCommandInteraction, bold } from "discord.js";

import { api } from "@/lib/api";
import { successEmbed } from "@/utils/embeds";
import { findMember } from "@/utils/members";
import { reply, replyNotAMember } from "@/utils/replies";

const ACCOUNT_NAMES = {
  altRsn: "alt",
  mainRsn: "main"
};

type Account = keyof typeof ACCOUNT_NAMES;

export const handleChangeRsn = async (interaction: ChatInputCommandInteraction) => {
  const account = interaction.options.getString("account", true) as Account;
  const rsn = interaction.options.getString("rsn", true);

  const member = await findMember(interaction.user);
  if (!member) return replyNotAMember(interaction, interaction.user);

  await api.patch("/v1/members/{id}", {
    params: { path: { id: member.id } },
    body: {
      actingDiscordId: interaction.user.id,
      [account]: rsn
    }
  });

  return reply(interaction, successEmbed({ description: `Your ${ACCOUNT_NAMES[account]} RSN is now ${bold(rsn)}.` }));
};
