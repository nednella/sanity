const DASH = "—";

export const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export const formatMs = (ms: number) => `${ms} ms`;

export const formatDate = (value: string | null) =>
  value === null
    ? DASH
    : new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export const formatNumber = (
  value: number | null | undefined,
  fractionDigits = 0,
  notation: "compact" | "standard" = "standard"
) =>
  value == null
    ? DASH
    : value.toLocaleString("en-GB", {
        notation,
        maximumFractionDigits: notation === "compact" ? 1 : fractionDigits,
        minimumFractionDigits: notation === "compact" ? 0 : fractionDigits
      });

// Old School RuneScape runs on a 0.6 second tick, so a run time only ever lands on a tick boundary. Counting
// in hundredths keeps that exact, and the game writes the seconds out to hundredths too.
const HUNDREDTHS_PER_TICK = 60;
const HUNDREDTHS_PER_MINUTE = 6000;
const HUNDREDTHS_PER_HOUR = 360_000;

const pad = (value: number) => String(value).padStart(2, "0");

export const formatTickTime = (seconds: number | null | undefined) => {
  if (seconds == null) return DASH;

  const hundredths = Math.round((seconds * 100) / HUNDREDTHS_PER_TICK) * HUNDREDTHS_PER_TICK;
  const hours = Math.floor(hundredths / HUNDREDTHS_PER_HOUR);
  const minutes = Math.floor((hundredths % HUNDREDTHS_PER_HOUR) / HUNDREDTHS_PER_MINUTE);
  const remainder = ((hundredths % HUNDREDTHS_PER_MINUTE) / 100).toFixed(2).padStart(5, "0");

  return hours > 0 ? `${hours}:${pad(minutes)}:${remainder}` : `${minutes}:${remainder}`;
};
