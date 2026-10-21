import { Collection } from "discord.js";

import type { Command } from "@/types";

import { adminHelp } from "./admin/admin-help/command";
import { channel } from "./admin/channel/command";
import { mainframe } from "./admin/mainframe/command";
import { help } from "./public/help/command";

const all: Command[] = [adminHelp, channel, help, mainframe];

export const commands = new Collection(all.map((command) => [command.name, command]));
