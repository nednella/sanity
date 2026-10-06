import type { ChatInputCommandInteraction, SlashCommandOptionsOnlyBuilder } from "discord.js";

export type Category = "General" | "Health";

export type Execute = (interaction: ChatInputCommandInteraction) => Promise<unknown>;

export type Command = SlashCommandOptionsOnlyBuilder & {
  admin: boolean;
  category: Category;
  selfOnly: boolean;
  execute: Execute;
};
