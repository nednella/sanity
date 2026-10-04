import { Collection } from "discord.js";

import type { Command } from "@/types";

const all: Command[] = [];

export const commands = new Collection(all.map((command) => [command.name, command]));
