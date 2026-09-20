import { asc } from "drizzle-orm";

import { db } from "@db/index";
import { ranks } from "@db/schema";

export const listRanks = () => db.select().from(ranks).orderBy(asc(ranks.id));

export type RankRow = Awaited<ReturnType<typeof listRanks>>[number];
