import { count } from "drizzle-orm";

import { db } from "@db/index";
import { members } from "@db/schema";

import type { ListMembersOptions } from "./list-members";
import { isActive } from "./shared/filters";

export const countMembers = async ({ active }: Pick<ListMembersOptions, "active">) => {
  const [row] = await db.select({ value: count() }).from(members).where(isActive(active));
  return row?.value ?? 0;
};
