import { BOSSES, MetricProps } from "@wise-old-man/utils";

import { client } from "@db/index";

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

console.log(`${saved} bosses saved, ${rates.length} with a wom rate`);

await client.end();
