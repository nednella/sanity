import { Collection } from "discord.js";

import type { Command } from "@/types";

import { adminHelp } from "./admin/admin-help/command";
import { admin } from "./admin/admin/command";
import { channels } from "./admin/channels/command";
import { health } from "./admin/health/command";
import { member } from "./admin/member/command";
import { plugin } from "./admin/plugin/command";
import { points } from "./admin/points/command";
import { rank } from "./admin/rank/command";
import { reviewer } from "./admin/reviewer/command";
import { birthday } from "./public/birthday/command";
import { help } from "./public/help/command";
import { pluginKey } from "./public/plugin-key/command";
import { profile } from "./public/profile/command";

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
  points,
  profile,
  rank,
  reviewer
];

export const commands = new Collection(all.map((command) => [command.name, command]));
