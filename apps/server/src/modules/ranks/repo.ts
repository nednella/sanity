import { db } from "@db/index";
import { ranks } from "@db/schema";
import { asc } from "drizzle-orm";

export const listRanks = () => db.select().from(ranks).orderBy(asc(ranks.id));
