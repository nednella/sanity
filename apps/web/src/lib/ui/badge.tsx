import { cn } from "@/lib/ui/utils";

const variants = {
  default: "",
  error: "badge-error",
  info: "badge-info",
  outline: "badge-outline",
  success: "badge-success",
  warning: "badge-warning"
};

const sizes = {
  default: "",
  sm: "badge-sm"
};

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

type BadgeProps = React.ComponentProps<"span"> & {
  size?: Size;
  variant?: Variant;
};

export function Badge({ className, size = "default", variant = "default", ...props }: Readonly<BadgeProps>) {
  return (
    <span
      className={cn("badge", variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
