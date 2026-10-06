import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";

import { handlePing } from "./handler";

export const ping = defineCommand({
  data: new SlashCommandBuilder().setName("ping").setDescription("Check the bot is alive"),
  category: "Health",
  admin: true,
  execute: handlePing
});
