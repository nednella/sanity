import { asc, ilike } from "drizzle-orm";

import { db } from "@db/index";
import { items } from "@db/schema";

export type ListItemsOptions = {
  limit: number;
  search?: string;
};

export const listItems = ({ limit, search }: ListItemsOptions) =>
  db
    .select()
    .from(items)
    .where(search === undefined ? undefined : ilike(items.name, `%${search}%`))
    .orderBy(asc(items.name))
    .limit(limit);
