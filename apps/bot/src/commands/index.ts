import { Collection } from "discord.js";

import type { Command } from "@/types";

import { mainframe } from "./mainframe";
import { ping } from "./ping";

const all: Command[] = [mainframe, ping];

export const commands = new Collection(all.map((command) => [command.name, command]));
