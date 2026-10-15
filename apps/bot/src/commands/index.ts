import { Collection } from "discord.js";

import type { Command } from "@/types";

import { addPoints } from "./admin/add-points/command";
import { adminHelp } from "./admin/admin-help/command";
import { mainframe } from "./admin/mainframe/command";
import { ping } from "./admin/ping/command";
import { help } from "./public/help/command";

const all: Command[] = [addPoints, adminHelp, help, mainframe, ping];

export const commands = new Collection(all.map((command) => [command.name, command]));
