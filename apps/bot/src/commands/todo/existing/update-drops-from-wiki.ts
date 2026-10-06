import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const updateDropsFromWiki = defineCommand({
  data: new SlashCommandBuilder().setName("update_drops_from_wiki").setDescription("Import drops from the wiki"),
  category: "Catalogue",
  admin: true,
  execute: replyNotImplemented
});
