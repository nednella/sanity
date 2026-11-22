import { formatNumber } from "@sanity/utils";

type ProgressBarProps = {
  label: string;
  target: number;
  value: number;
};

export function ProgressBar({ label, value, target }: Readonly<ProgressBarProps>) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="tabular-nums">
          {formatNumber(value)} / {formatNumber(target)}
        </span>
      </div>
      <progress
        className="progress h-1.5 progress-primary"
        max={target}
        value={Math.min(value, target)}
      />
    </div>
  );
}
