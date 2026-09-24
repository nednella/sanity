import { formatNumber } from "@/utils/numbers";

type ProgressBarProps = {
  label: string;
  value: number;
  target: number;
};

export function ProgressBar({ label, value, target }: Readonly<ProgressBarProps>) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs text-base-content/60">
        <span>{label}</span>
        <span className="tabular-nums">
          {formatNumber(value)} / {formatNumber(target)}
        </span>
      </div>
      <progress
        className="progress h-1.5 progress-primary"
        value={Math.min(value, target)}
        max={target}
      />
    </div>
  );
}
