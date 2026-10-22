import { Collection } from "discord.js";

import type { Command } from "@/types";

import { adminHelp } from "./admin/admin-help/command";
import { channels } from "./admin/channels/command";
import { health } from "./admin/health/command";
import { member } from "./admin/member/command";
import { rank } from "./admin/rank/command";
import { help } from "./public/help/command";

const all: Command[] = [adminHelp, channels, health, help, member, rank];

export const commands = new Collection(all.map((command) => [command.name, command]));
