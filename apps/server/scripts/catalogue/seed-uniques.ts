import { eq, sql } from "drizzle-orm";

import { client, db } from "@db/index";
import { bosses, items } from "@db/schema";

import { importItems } from "@/modules/catalogue/service/import-items";
import { importUniques } from "@/modules/catalogue/service/import-uniques";

import catalogue from "./uniques.json" with { type: "json" };

type Catalogue = { boss: string; killsPerHour?: number; uniques: { name: string; dropRate: number }[] }[];

const seed = catalogue as Catalogue;

for (const { boss, killsPerHour } of seed) {
  if (killsPerHour !== undefined) await db.update(bosses).set({ killsPerHour }).where(eq(bosses.name, boss));
}

await importItems(seed.flatMap(({ uniques }) => uniques.map(({ name }) => ({ name }))));

const storedBosses = await db.select({ id: bosses.id, name: bosses.name }).from(bosses);
const storedItems = await db.select({ id: items.id, name: items.name }).from(items);

const bossIds = new Map(storedBosses.map((boss) => [boss.name.toLowerCase(), boss.id]));
const itemIds = new Map(storedItems.map((item) => [item.name.toLowerCase(), item.id]));

const missing: string[] = [];

const rows = seed.flatMap(({ boss, uniques }) => {
  const bossId = bossIds.get(boss.toLowerCase());
  if (bossId === undefined) {
    missing.push(boss);
    return [];
  }

  return uniques.flatMap(({ name, dropRate }) => {
    const itemId = itemIds.get(name.toLowerCase());
    if (itemId === undefined) {
      missing.push(`${boss}: ${name}`);
      return [];
    }

    return [{ bossId, itemId, dropRate }];
  });
});

const saved = await importUniques(rows);

const [rated] = await db
  .select({ value: sql<number>`count(*)::int` })
  .from(bosses)
  .where(sql`${bosses.killsPerHour} is not null`);

console.log(`${saved} uniques saved across ${seed.length} bosses, ${rated?.value} bosses with our own rate`);
if (missing.length > 0) console.log(`unmatched:\n  ${missing.join("\n  ")}`);

await client.end();
