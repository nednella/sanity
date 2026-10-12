import { isNull, sql } from "drizzle-orm";

import { client, db } from "@db/index";
import { items } from "@db/schema";

import { importItems } from "@/modules/catalogue/service/import-items";

const CACHE_URL = "https://static.runelite.net/cache/item/names.json";

const response = await fetch(CACHE_URL);
const names = (await response.json()) as Record<string, string>;

const idByName = new Map<string, number>();
for (const [id, name] of Object.entries(names)) {
  const key = name.toLowerCase();
  const current = idByName.get(key);
  if (current === undefined || Number(id) < current) idByName.set(key, Number(id));
}

const stored = await db.select({ id: items.id, name: items.name }).from(items);

const resolved = stored.flatMap((item) => {
  const osrsItemId = idByName.get(item.name.toLowerCase());
  return osrsItemId === undefined ? [] : [{ name: names[String(osrsItemId)]!, osrsItemId }];
});

const saved = await importItems(resolved);

const [unresolved] = await db
  .select({ value: sql<number>`count(*)::int` })
  .from(items)
  .where(isNull(items.osrsItemId));

console.log(`${idByName.size} game items read, ${saved} of our ${stored.length} resolved`);
console.log(`${unresolved?.value} items still without an id`);

await client.end();
