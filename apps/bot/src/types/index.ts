import type { ChatInputCommandInteraction, SlashCommandOptionsOnlyBuilder } from "discord.js";

export type Category = "Health";

export type Execute = (interaction: ChatInputCommandInteraction) => Promise<unknown>;

export type Command = SlashCommandOptionsOnlyBuilder & {
  category: Category;
  execute: Execute;
};
