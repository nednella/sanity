import { Collection } from "discord.js";

import type { Command } from "@/types";

import { adminHelp } from "./admin/admin-help/command";
import { checkRank } from "./admin/check-rank/command";
import { mainframe } from "./admin/mainframe/command";
import { passTrial } from "./admin/pass-trial/command";
import { ping } from "./admin/ping/command";
import { quitto } from "./admin/quitto/command";
import { rank } from "./admin/rank/command";
import { ranksGracePeriod } from "./admin/ranks-grace-period/command";
import { retire } from "./admin/retire/command";
import { trial } from "./admin/trial/command";
import { unretire } from "./admin/unretire/command";
import { help } from "./public/help/command";

const all: Command[] = [
  adminHelp,
  checkRank,
  help,
  mainframe,
  passTrial,
  ping,
  quitto,
  rank,
  ranksGracePeriod,
  retire,
  trial,
  unretire
];

export const commands = new Collection(all.map((command) => [command.name, command]));
