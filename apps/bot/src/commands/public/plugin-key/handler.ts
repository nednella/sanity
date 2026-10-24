import { type ChatInputCommandInteraction, codeBlock } from "discord.js";

import { api } from "@/lib/api";
import { buildEmbed } from "@/utils/embeds";
import { reply } from "@/utils/replies";

const PASTE_INSTRUCTIONS =
  "In RuneLite, open **Configuration**, find the **Sanity** plugin and paste it into **API Key**.";

const KEEP_SECRET = "Keep it to yourself. If it leaks, run this command again: a new key revokes the old one.";

export const handlePluginKey = async (interaction: ChatInputCommandInteraction) => {
  const { key } = await api.post("/v1/auth/plugin-key");

  await reply(
    interaction,
    buildEmbed({
      style: "success",
      title: "RuneLite Plugin API Key",
      description: `${codeBlock(key)}\n${PASTE_INSTRUCTIONS}\n\n${KEEP_SECRET}`
    })
  );
};
