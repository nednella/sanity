export const DASH = "—";

export function formatNumber(value: number | null | undefined, fractionDigits = 0) {
  if (value == null) return DASH;
  return value.toLocaleString("en-GB", {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits
  });
}

export function formatDate(value: string | null | undefined) {
  if (value == null) return DASH;
  return new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

const relativeUnits = [
  { unit: "year" as const, ms: 365 * 24 * 60 * 60 * 1000 },
  { unit: "month" as const, ms: 30 * 24 * 60 * 60 * 1000 },
  { unit: "day" as const, ms: 24 * 60 * 60 * 1000 },
  { unit: "hour" as const, ms: 60 * 60 * 1000 },
  { unit: "minute" as const, ms: 60 * 1000 }
];

export function formatRelativeDate(value: string | null | undefined) {
  if (value == null) return DASH;

  const formatter = new Intl.RelativeTimeFormat("en-GB", { numeric: "auto" });
  const elapsed = new Date(value).getTime() - Date.now();

  for (const { unit, ms } of relativeUnits) {
    if (Math.abs(elapsed) >= ms) return formatter.format(Math.round(elapsed / ms), unit);
  }

  return formatter.format(Math.round(elapsed / 1000), "second");
}

export function formatRsn({ main, alt }: { main: string | null; alt: string | null }) {
  return [main, alt].filter(Boolean).join(" / ");
}
