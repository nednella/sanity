import { ACTIVITIES, BOSSES, COMPUTED_METRICS, SKILLS } from "@wise-old-man/utils";

/**
 * Wise Old Man declares its metric lists in display order: the in-game skill tab, bosses A-Z, the
 * hiscores activities. Sorting here means every client renders a snapshot the same way.
 */
const inOrder = <K extends string>(metrics: readonly string[], key: K) => {
  const order = new Map(metrics.map((metric, index) => [metric, index]));

  // A metric missing from the list is pushed to the end, never discarded.
  const rank = (metric: string) => order.get(metric) ?? order.size;

  return <T extends Record<K, string>>(rows: T[]) => rows.toSorted((a, b) => rank(a[key]) - rank(b[key]));
};

export const sortActivities = inOrder(ACTIVITIES, "activity");
export const sortBosses = inOrder(BOSSES, "boss");
export const sortComputed = inOrder(COMPUTED_METRICS, "metric");
export const sortSkills = inOrder(SKILLS, "skill");
