import { Collection } from "discord.js";

import type { Command } from "@/types";

import { adminHelp } from "./admin/admin-help/command";
import { channels } from "./admin/channels/command";
import { health } from "./admin/health/command";
import { help } from "./public/help/command";

const all: Command[] = [adminHelp, channels, health, help];

export const commands = new Collection(all.map((command) => [command.name, command]));
