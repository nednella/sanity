import { asc } from "drizzle-orm";

import { db } from "../../../db/index.js";
import { ranks } from "../../../db/schema.js";

export const listRanks = () => db.select().from(ranks).orderBy(asc(ranks.id));
