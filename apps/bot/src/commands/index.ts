import { Collection } from "discord.js";

import type { Command } from "@/types";

import { health } from "./health";
import { ping } from "./ping";

const all: Command[] = [health, ping];

export const commands = new Collection(all.map((command) => [command.name, command]));
