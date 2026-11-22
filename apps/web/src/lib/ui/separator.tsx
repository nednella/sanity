import { cn } from "cn";

type SeparatorProps = React.ComponentProps<"hr"> & {
  orientation?: "horizontal" | "vertical";
};

export function Separator({ className, orientation = "horizontal", ...props }: Readonly<SeparatorProps>) {
  return (
    <hr
      aria-orientation={orientation}
      className={cn("shrink-0 bg-base-300", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className)}
      {...props}
    />
  );
}

type LabelledSeparatorProps = React.ComponentProps<"div"> & {
  childrenClassName?: string;
};

export function LabelledSeparator({
  className,
  children,
  childrenClassName,
  ...props
}: Readonly<LabelledSeparatorProps>) {
  return (
    <div
      className={cn("divider", className)}
      role="separator"
      {...props}
    >
      {children && <span className={cn("text-sm", childrenClassName)}>{children}</span>}
    </div>
  );
}
