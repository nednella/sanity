import { cn } from "@/lib/ui/utils";

const placements = {
  bottom: "tooltip-bottom",
  left: "tooltip-left",
  right: "tooltip-right",
  top: "tooltip-top"
};

type TooltipProps = {
  children: React.ReactNode;
  className?: string;
  placement?: keyof typeof placements;
  tip: string;
};

export function Tooltip({ children, className, placement = "top", tip }: Readonly<TooltipProps>) {
  return (
    <span
      className={cn("tooltip", placements[placement], className)}
      data-tip={tip}
    >
      {children}
    </span>
  );
}
