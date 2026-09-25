import { DASH } from "@/utils/dash";

const relativeUnitsInMs = [
  { unit: "year" as const, ms: 365 * 24 * 60 * 60 * 1000 },
  { unit: "month" as const, ms: 30 * 24 * 60 * 60 * 1000 },
  { unit: "day" as const, ms: 24 * 60 * 60 * 1000 },
  { unit: "hour" as const, ms: 60 * 60 * 1000 },
  { unit: "minute" as const, ms: 60 * 1000 }
];

export function formatDate(value: string | null | undefined) {
  if (value == null) return DASH;
  return new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatRelativeDate(value: string | null | undefined) {
  if (value == null) return DASH;

  const formatter = new Intl.RelativeTimeFormat("en-GB", { numeric: "auto" });
  const elapsed = new Date(value).getTime() - Date.now();

  for (const { unit, ms } of relativeUnitsInMs) {
    if (Math.abs(elapsed) >= ms) return formatter.format(Math.round(elapsed / ms), unit);
  }

  return "just now";
}

const pad = (value: number) => String(value).padStart(2, "0");

// Old School RuneScape runs on a 0.6 second tick, so a run time only ever lands on a tick boundary. Counting
// in hundredths keeps that exact, and the game writes the seconds out to hundredths too.
const HUNDREDTHS_PER_TICK = 60;
const HUNDREDTHS_PER_MINUTE = 6000;
const HUNDREDTHS_PER_HOUR = 360_000;

export function formatTickTime(seconds: number | null | undefined) {
  if (seconds == null) return DASH;

  const hundredths = Math.round((seconds * 100) / HUNDREDTHS_PER_TICK) * HUNDREDTHS_PER_TICK;
  const hours = Math.floor(hundredths / HUNDREDTHS_PER_HOUR);
  const minutes = Math.floor((hundredths % HUNDREDTHS_PER_HOUR) / HUNDREDTHS_PER_MINUTE);
  const remainder = ((hundredths % HUNDREDTHS_PER_MINUTE) / 100).toFixed(2).padStart(5, "0");

  return hours > 0 ? `${hours}:${pad(minutes)}:${remainder}` : `${minutes}:${remainder}`;
}
