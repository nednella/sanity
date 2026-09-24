import { DASH } from "@/utils/dash";

export function formatNumber(
  value: number | null | undefined,
  fractionDigits: number = 0,
  notation: "compact" | "standard" = "standard"
) {
  if (value == null) return DASH;

  return value.toLocaleString("en-GB", {
    notation,
    maximumFractionDigits: notation === "compact" ? 1 : fractionDigits,
    minimumFractionDigits: notation === "compact" ? 0 : fractionDigits
  });
}
