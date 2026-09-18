import { cn } from "@/lib/ui/utils";

type SeparatorProps = React.ComponentProps<"div"> & {
  orientation?: "horizontal" | "vertical";
};

type LabelledSeparatorProps = React.ComponentProps<"div"> & {
  childrenClassName?: string;
};

export function Separator({ className, orientation = "horizontal", ...props }: Readonly<SeparatorProps>) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn("shrink-0 bg-base-300", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className)}
      {...props}
    />
  );
}

export function LabelledSeparator({
  className,
  children,
  childrenClassName,
  ...props
}: Readonly<LabelledSeparatorProps>) {
  return (
    <div
      role="separator"
      className={cn("divider", className)}
      {...props}
    >
      {children && <span className={cn("text-sm", childrenClassName)}>{children}</span>}
    </div>
  );
}
