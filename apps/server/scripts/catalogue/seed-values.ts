import { client, db } from "@db/index";
import { items } from "@db/schema";

import { importItems } from "@/modules/catalogue/service/import-items";

import catalogue from "./values.json" with { type: "json" };

type Values = { name: string; rule: "exact" | "minimum"; valueMillions: number }[];

const seed = catalogue as Values;

const storedItems = await db.select({ name: items.name }).from(items);
const storedNames = new Map(storedItems.map(({ name }) => [name.toLowerCase(), name]));

const missing: string[] = [];

const rows = seed.flatMap(({ name, rule, valueMillions }) => {
  const storedName = storedNames.get(name.toLowerCase());
  if (storedName === undefined) {
    missing.push(name);
    return [];
  }

  return [{ name: storedName, valueMillions, valueRule: rule }];
});

const saved = await importItems(rows);

console.log(`${saved} item values saved`);
if (missing.length > 0) console.log(`unmatched:\n  ${missing.join("\n  ")}`);

await client.end();
