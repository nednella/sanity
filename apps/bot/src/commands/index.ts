import { Collection } from "discord.js";

import type { Command } from "@/types";

import { addPoints } from "./admin/add-points/command";
import { adminHelp } from "./admin/admin-help/command";
import { mainframe } from "./admin/mainframe/command";
import { ping } from "./admin/ping/command";
import { age } from "./public/age/command";
import { birthdayAdd } from "./public/birthday-add/command";
import { changeRsn } from "./public/change-rsn/command";
import { diary } from "./public/diary/command";
import { help } from "./public/help/command";
import { profile } from "./public/profile/command";

const all: Command[] = [addPoints, adminHelp, age, birthdayAdd, changeRsn, diary, help, mainframe, ping, profile];

export const commands = new Collection(all.map((command) => [command.name, command]));
