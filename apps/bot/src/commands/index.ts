import { Collection } from "discord.js";

import type { Command } from "@/types";

import { adminHelp } from "./admin/admin-help/command";
import { admin } from "./admin/admin/command";
import { channels } from "./admin/channels/command";
import { health } from "./admin/health/command";
import { member } from "./admin/member/command";
import { plugin } from "./admin/plugin/command";
import { rank } from "./admin/rank/command";
import { reviewer } from "./admin/reviewer/command";
import { birthday } from "./public/birthday/command";
import { help } from "./public/help/command";
import { pluginKey } from "./public/plugin-key/command";
import { profile } from "./public/profile/command";
import { rsn } from "./public/rsn/command";

const all: Command[] = [
  admin,
  adminHelp,
  birthday,
  channels,
  health,
  help,
  member,
  plugin,
  pluginKey,
  profile,
  rank,
  reviewer,
  rsn
];

export const commands = new Collection(all.map((command) => [command.name, command]));
