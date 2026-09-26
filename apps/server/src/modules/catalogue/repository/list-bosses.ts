import { asc } from "drizzle-orm";

import { db } from "@db/index";
import { bosses } from "@db/schema";

export const listBosses = () => db.select().from(bosses).orderBy(asc(bosses.name));
