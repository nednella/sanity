import type { ChatInputCommandInteraction, SlashCommandOptionsOnlyBuilder } from "discord.js";

export type Category = "Health";

export type Execute = (interaction: ChatInputCommandInteraction) => Promise<unknown>;

export type Command = SlashCommandOptionsOnlyBuilder & {
  admin: boolean;
  category: Category;
  ephemeral: boolean;
  execute: Execute;
};
