import { BOSSES, MetricProps } from "@wise-old-man/utils";
import { isNull, sql } from "drizzle-orm";

import { client, db } from "@db/index";
import { bosses, speedrunContent } from "@db/schema";

import { wom } from "@/integrations/wom";
import { saveBosses } from "@/modules/catalogue/repository/save-bosses";

const toDisplayName = (metric: (typeof BOSSES)[number]) => MetricProps[metric].name.replaceAll(" Of ", " of ");

const rates = await wom.efficiency.getEHBRates("main");
const ratePerBoss = new Map(rates.map(({ boss, rate }) => [boss, rate]));

const saved = await saveBosses(
  BOSSES.map((metric) => ({
    womMetric: metric,
    name: toDisplayName(metric),
    womKillsPerHour: ratePerBoss.get(metric) ?? null
  }))
);

const linked = await db
  .update(speedrunContent)
  .set({ bossId: sql`(select id from ${bosses} where ${bosses.womMetric} = ${speedrunContent.name})` })
  .where(isNull(speedrunContent.bossId))
  .returning({ id: speedrunContent.id });

const [unlinked] = await db
  .select({ value: sql<number>`count(*)::int` })
  .from(speedrunContent)
  .where(isNull(speedrunContent.bossId));

console.log(`${saved} bosses saved, ${rates.length} with a wom rate`);
console.log(`${linked.length} content rows linked, ${unlinked?.value} still without a boss`);

await client.end();
