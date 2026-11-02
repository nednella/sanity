import { ACTIVITIES, BOSSES, COMPUTED_METRICS, MetricProps, SKILLS, isMetric } from "@wise-old-man/utils";

import { OSRS_ITEM_ICONS_URL, OSRS_WIKI_IMAGES_URL } from "@sanity/urls";

import { DASH } from "./text";

// Old School RuneScape runs on a 0.6 second tick, so a run time only ever lands on a tick boundary. Counting
// in hundredths keeps that exact, and the game writes the seconds out to hundredths too.
const HUNDREDTHS_PER_TICK = 60;
const HUNDREDTHS_PER_MINUTE = 6000;
const HUNDREDTHS_PER_HOUR = 360_000;

const pad = (value: number) => String(value).padStart(2, "0");

const TEAM_NAMES: Record<number, string> = {
  1: "Solo",
  2: "Duo",
  3: "Trio"
};

/**
 * Wise Old Man declares its metric lists in display order: the in-game skill tab, bosses A-Z, the
 * hiscores activities. Sorting here means every client renders a snapshot the same way.
 */
function inOrder<K extends string>(metrics: readonly string[], key: K) {
  const order = new Map(metrics.map((metric, index) => [metric, index]));

  // A metric missing from the list is pushed to the end, never discarded.
  const rank = (metric: string) => order.get(metric) ?? order.size;

  return <T extends Record<K, string>>(rows: T[]) => rows.toSorted((a, b) => rank(a[key]) - rank(b[key]));
}

export function asRsn(name: string) {
  return name.toLowerCase().replaceAll(/[_-]/g, " ").trim();
}

export function formatTickTime(seconds: number | null | undefined) {
  if (seconds == null) return DASH;

  const hundredths = Math.round((seconds * 100) / HUNDREDTHS_PER_TICK) * HUNDREDTHS_PER_TICK;
  const hours = Math.floor(hundredths / HUNDREDTHS_PER_HOUR);
  const minutes = Math.floor((hundredths % HUNDREDTHS_PER_HOUR) / HUNDREDTHS_PER_MINUTE);
  const remainder = ((hundredths % HUNDREDTHS_PER_MINUTE) / 100).toFixed(2).padStart(5, "0");

  return hours > 0 ? `${hours}:${pad(minutes)}:${remainder}` : `${minutes}:${remainder}`;
}

export function itemIconUrl(osrsItemId: number) {
  return `${OSRS_ITEM_ICONS_URL}/${osrsItemId}.png`;
}

/**
 * Map the snake_case metric key into the formatted display name using Wise Old Man's MetricProps.
 * We use the raw key as a fallback so any new entries still read without a package version bump.
 */
export function metricName(metric: string) {
  return isMetric(metric) ? MetricProps[metric].name : metric;
}

export function osrsWikiImageUrl(fileName: string) {
  return `${OSRS_WIKI_IMAGES_URL}/${fileName}`;
}

export function teamScale(scale: number) {
  return TEAM_NAMES[scale] ?? `${scale}-man`;
}

export const sortActivities = inOrder(ACTIVITIES, "activity");
export const sortBosses = inOrder(BOSSES, "boss");
export const sortComputed = inOrder(COMPUTED_METRICS, "metric");
export const sortSkills = inOrder(SKILLS, "skill");
