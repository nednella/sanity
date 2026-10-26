import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";

import { handleApiKey } from "./handler";

export const apiKey = defineCommand({
  data: new SlashCommandBuilder()
    .setName("api_key")
    .setDescription("Manage the keys that call the mainframe")
    .addSubcommand((subcommand) => subcommand.setName("create").setDescription("Create a key for a bot"))
    .addSubcommand((subcommand) => subcommand.setName("list").setDescription("Show the keys that are not revoked"))
    .addSubcommand((subcommand) =>
      subcommand
        .setName("revoke")
        .setDescription("Revoke a key, so that it stops working")
        .addIntegerOption((option) =>
          option.setName("id").setDescription("The key's number").setRequired(true).setMinValue(1)
        )
    ),
  category: "Setup",
  admin: true,
  selfOnly: true,
  execute: handleApiKey
});
