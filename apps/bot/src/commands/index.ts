import { Collection } from "discord.js";

import type { Command } from "@/types";

import { health } from "./health";

const all: Command[] = [health];

export const commands = new Collection(all.map((command) => [command.name, command]));
