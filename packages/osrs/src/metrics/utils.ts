import { Activity, Boss, METRICS, type Metric, Skill } from "./enum.js";

const isMetric = (value: string): value is Metric => Object.hasOwn(METRICS, value);

// Fallback to the key for unknown metrics, so new changes from Wise Old Man are still readable.
export const metricName = (metric: string) => (isMetric(metric) ? METRICS[metric] : metric);

type MetricEnum = typeof Activity | typeof Boss | typeof Skill;

// Sorts by the enum's declaration order: the in-game skill tab, bosses A-Z, the hiscores activities.
const sortBy = <K extends string>(metrics: MetricEnum, key: K) => {
  const order = new Map(Object.keys(metrics).map((metric, index) => [metric, index]));

  // A metric missing from the enum is pushed to the end, never discarded.
  const rank = (metric: string) => order.get(metric) ?? order.size;

  return <T extends Record<K, string>>(items: T[]) => items.toSorted((a, b) => rank(a[key]) - rank(b[key]));
};

export const sortActivities = sortBy(Activity, "activity");
export const sortBosses = sortBy(Boss, "boss");
export const sortSkills = sortBy(Skill, "skill");
