import { cn } from "@/lib/ui/utils";

type Props = React.ComponentPropsWithRef<"h4">;

export function H4({ ref, className, children }: Readonly<Props>) {
  return (
    <h4
      ref={ref}
      className={cn("text-xs font-semibold tracking-wide text-base-content/60 uppercase", className)}
    >
      {children}
    </h4>
  );
}
