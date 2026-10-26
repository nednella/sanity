import { Collection } from "discord.js";

import type { Command } from "@/types";

import { adminHelp } from "./admin/admin-help/command";
import { admin } from "./admin/admin/command";
import { apiKey } from "./admin/api-key/command";
import { channels } from "./admin/channels/command";
import { health } from "./admin/health/command";
import { member } from "./admin/member/command";
import { plugin } from "./admin/plugin/command";
import { rank } from "./admin/rank/command";
import { help } from "./public/help/command";
import { pluginKey } from "./public/plugin-key/command";
import { rsn } from "./public/rsn/command";

const all: Command[] = [admin, adminHelp, apiKey, channels, health, help, member, plugin, pluginKey, rank, rsn];

export const commands = new Collection(all.map((command) => [command.name, command]));
