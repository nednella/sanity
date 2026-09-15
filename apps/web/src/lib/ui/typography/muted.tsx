import { cn } from "@/lib/ui/utils.js";

type Props = React.ComponentPropsWithRef<"p">;

export function Muted({ ref, className, children }: Readonly<Props>) {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-base-content/60", className)}
    >
      {children}
    </p>
  );
}
