import { Tooltip } from "@/lib/ui/tooltip";
import { formatDate, formatRelativeDate } from "@/utils/dates";

type RelativeDateProps = {
  value: string | null | undefined;
};

// "3 weeks ago" reads better than a date, but the date is what someone reaches for next.
export function RelativeDate({ value }: Readonly<RelativeDateProps>) {
  return <Tooltip tip={formatDate(value)}>{formatRelativeDate(value)}</Tooltip>;
}
