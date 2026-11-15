import { cn } from "@/lib/ui/utils";

type Props = React.ComponentPropsWithRef<"p">;

export function Muted({ ref, className, children }: Readonly<Props>) {
  return (
    <p
      className={cn("text-sm text-base-content/60", className)}
      ref={ref}
    >
      {children}
    </p>
  );
}
