import { formatDate, formatRelativeDate } from "@sanity/utils";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/lib/ui/tooltip";

type RelativeDateProps = {
  value: string | null | undefined;
};

// "3 weeks ago" reads better than a date, but the date is what someone reaches
// for next.
export function RelativeDate({ value }: Readonly<RelativeDateProps>) {
  return (
    <Tooltip>
      <TooltipTrigger render={<span />}>{formatRelativeDate(value)}</TooltipTrigger>
      <TooltipContent>{formatDate(value)}</TooltipContent>
    </Tooltip>
  );
}
