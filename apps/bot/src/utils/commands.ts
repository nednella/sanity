import type { SlashCommandOptionsOnlyBuilder } from "discord.js";

import type { Category, Command, Execute } from "@/types";

type Options = {
  category: Category;
  data: SlashCommandOptionsOnlyBuilder;
  execute: Execute;
};

export const defineCommand = ({ data, ...options }: Options): Command => Object.assign(data, options);
