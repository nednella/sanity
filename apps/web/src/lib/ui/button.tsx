import { cn } from "cn";
import { cloneElement, isValidElement } from "react";

const variants = {
  default: "btn-primary",
  outline: "btn-outline",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  link: "btn-link",
  custom: ""
};

const sizes = {
  default: "h-9 px-4",
  sm: "btn-sm text-xs",
  lg: "h-10 px-6",
  icon: "btn-square"
};

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

type ButtonProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
  size?: Size;
  variant?: Variant;
};

// With asChild, the button's classes go on its only child, so a link can look
// like a button.
export function Button({ className, variant, size, asChild = false, children, ...props }: Readonly<ButtonProps>) {
  const classes = cn(
    buttonVariants({
      variant,
      size
    }),
    className
  );

  if (asChild && isValidElement<{ className?: string }>(children)) {
    // oxlint-disable-next-line react/no-clone-element -- the asChild pattern
    return cloneElement(children, { className: cn(classes, children.props.className) });
  }

  return (
    <button
      className={classes}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

function buttonVariants({ variant = "default", size = "default" }: { size?: Size; variant?: Variant } = {}) {
  return cn("btn text-sm font-medium", variants[variant], sizes[size]);
}
