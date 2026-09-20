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
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
