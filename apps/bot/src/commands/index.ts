import { Collection } from "discord.js";

import type { Command } from "@/types";

import { adminHelp, help } from "./help/command";
import { mainframe } from "./mainframe/command";
import { ping } from "./ping/command";

const all: Command[] = [adminHelp, help, mainframe, ping];

export const commands = new Collection(all.map((command) => [command.name, command]));
