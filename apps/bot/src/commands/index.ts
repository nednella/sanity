import { Collection } from "discord.js";

import type { Command } from "@/types";

import { adminHelp } from "./admin-help";
import { help } from "./help";
import { mainframe } from "./mainframe";
import { ping } from "./ping";

const all: Command[] = [adminHelp, help, mainframe, ping];

export const commands = new Collection(all.map((command) => [command.name, command]));
