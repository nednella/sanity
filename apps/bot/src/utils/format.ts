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
