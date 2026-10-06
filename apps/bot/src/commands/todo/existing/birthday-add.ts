import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const birthdayAdd = defineCommand({
  data: new SlashCommandBuilder().setName("birthday_add").setDescription("Add your birthday"),
  category: "Profile",
  execute: replyNotImplemented
});
