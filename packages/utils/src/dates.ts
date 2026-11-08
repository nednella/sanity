import { DASH } from "./text";

const RELATIVE_UNITS_IN_MS = [
  { unit: "year" as const, ms: 365 * 24 * 60 * 60 * 1000 },
  { unit: "month" as const, ms: 30 * 24 * 60 * 60 * 1000 },
  { unit: "day" as const, ms: 24 * 60 * 60 * 1000 },
  { unit: "hour" as const, ms: 60 * 60 * 1000 },
  { unit: "minute" as const, ms: 60 * 1000 }
];

const pluralise = (value: number, unit: string) => `${value} ${unit}${value === 1 ? "" : "s"}`;

export function formatDate(value: string | null | undefined) {
  if (value == null) return DASH;
  return new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatRelativeDate(value: string | null | undefined) {
  if (value == null) return DASH;

  const formatter = new Intl.RelativeTimeFormat("en-GB", { numeric: "auto" });
  const elapsed = new Date(value).getTime() - Date.now();

  for (const { unit, ms } of RELATIVE_UNITS_IN_MS) {
    if (Math.abs(elapsed) >= ms) return formatter.format(Math.round(elapsed / ms), unit);
  }

  return "just now";
}

export function timeSince(start: Date, end: Date) {
  let years = end.getUTCFullYear() - start.getUTCFullYear();
  let months = end.getUTCMonth() - start.getUTCMonth();
  let days = end.getUTCDate() - start.getUTCDate();

  if (days < 0) {
    months -= 1;
    days += new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 0)).getUTCDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return [pluralise(years, "year"), pluralise(months, "month"), pluralise(days, "day")].join(" ");
}

export function firstOfNextMonth(from: Date) {
  return new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + 1, 1));
}

type RelativeDateUnits = {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  ms?: number;
};

export function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

// Months and years keep the day of the month, or the last day of a shorter month.
export function relativeDate(
  { years = 0, months = 0, weeks = 0, days = 0, hours = 0, minutes = 0, seconds = 0, ms = 0 }: RelativeDateUnits,
  reference: Date = new Date()
) {
  const date = new Date(reference);
  date.setUTCMilliseconds(date.getUTCMilliseconds() + ms);
  date.setUTCSeconds(date.getUTCSeconds() + seconds);
  date.setUTCMinutes(date.getUTCMinutes() + minutes);
  date.setUTCHours(date.getUTCHours() + hours);
  date.setUTCDate(date.getUTCDate() + days + weeks * 7);

  const totalMonths = date.getUTCMonth() + months + years * 12;
  const year = date.getUTCFullYear() + Math.floor(totalMonths / 12);
  const month = ((totalMonths % 12) + 12) % 12;
  const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  date.setUTCFullYear(year, month, Math.min(date.getUTCDate(), lastDayOfMonth));
  return date;
}
