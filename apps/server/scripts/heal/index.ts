import { and, eq, sql } from "drizzle-orm";

import { client, db } from "@db/index";
import { bossUniques, items, submissions } from "@db/schema";

import { saveItems } from "@/modules/catalogue/repository/save-items";

import plan from "./items.json" with { type: "json" };

type Plan = {
  merge: Record<string, string>;
  ids: Record<string, number>;
};

const { merge, ids } = plan as Plan;

for (const [wrong, right] of Object.entries(merge)) {
  await db.transaction(async (tx) => {
    const [source] = await tx.select({ id: items.id }).from(items).where(eq(items.name, wrong));
    if (!source) return;

    await saveItems(tx, [{ name: right }]);
    const [target] = await tx.select({ id: items.id }).from(items).where(eq(items.name, right));

    await tx.update(submissions).set({ itemId: target!.id }).where(eq(submissions.itemId, source.id));
    await tx.update(bossUniques).set({ itemId: target!.id }).where(sql`
      ${bossUniques.itemId} = ${source.id}
      and not exists (
        select 1 from ${bossUniques} kept
        where kept.boss_id = ${bossUniques.bossId} and kept.item_id = ${target!.id}
      )
    `);
    await tx.delete(items).where(eq(items.id, source.id));

    console.log(`merged ${wrong} into ${right}`);
  });
}

for (const [name, osrsItemId] of Object.entries(ids)) {
  const updated = await db
    .update(items)
    .set({ osrsItemId })
    .where(and(eq(items.name, name), sql`${items.osrsItemId} is distinct from ${osrsItemId}`))
    .returning({ id: items.id });

  if (updated.length > 0) console.log(`set ${name} to game item ${osrsItemId}`);
}

const remaining = await db
  .select({ name: items.name, uses: sql<number>`count(${submissions.id})::int` })
  .from(items)
  .leftJoin(submissions, eq(submissions.itemId, items.id))
  .where(sql`${items.osrsItemId} is null`)
  .groupBy(items.id, items.name)
  .orderBy(sql`count(${submissions.id}) desc`);

console.log(`${remaining.length} items left without a game item:`);
for (const item of remaining) console.log(`  ${String(item.uses).padStart(5)}  ${item.name}`);

await client.end();
