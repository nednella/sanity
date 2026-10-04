import type { ChatInputCommandInteraction, SlashCommandOptionsOnlyBuilder } from "discord.js";

export type Execute = (interaction: ChatInputCommandInteraction) => Promise<unknown>;

export type Command = SlashCommandOptionsOnlyBuilder & { execute: Execute };
