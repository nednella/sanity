import { asc } from "drizzle-orm";

import { db } from "@db/index";
import { discordChannels } from "@db/schema";

export function listChannels() {
  return db.select().from(discordChannels).orderBy(asc(discordChannels.purpose));
}
