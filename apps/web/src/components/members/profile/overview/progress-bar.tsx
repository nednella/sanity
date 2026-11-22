import { formatNumber } from "@sanity/utils";

import { Progress, ProgressLabel, ProgressValue } from "@/lib/ui/progress";

type ProgressBarProps = {
  label: string;
  target: number;
  value: number;
};

export function ProgressBar({ label, value, target }: Readonly<ProgressBarProps>) {
  return (
    <Progress
      className="gap-1"
      max={target}
      value={Math.min(value, target)}
    >
      <ProgressLabel className="text-muted-foreground">{label}</ProgressLabel>
      <ProgressValue>{() => `${formatNumber(value)} / ${formatNumber(target)}`}</ProgressValue>
    </Progress>
  );
}
