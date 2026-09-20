import { and, count } from "drizzle-orm";

import { db } from "@db/index";
import { members } from "@db/schema";

import type { ListMembersOptions } from "./list-members";
import { isActive, matchesSearch } from "./shared/filters";

export const countMembers = async ({ active, search }: Pick<ListMembersOptions, "active" | "search">) => {
  const [row] = await db
    .select({ value: count() })
    .from(members)
    .where(and(isActive(active), matchesSearch(search)));
  return row?.value ?? 0;
};
