import type { SlashCommandOptionsOnlyBuilder } from "discord.js";

import type { Command, Execute } from "@/types";

export const defineCommand = (data: SlashCommandOptionsOnlyBuilder, execute: Execute): Command =>
  Object.assign(data, { execute });
