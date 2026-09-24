import { cn } from "@/lib/ui/utils";

type Props = React.ComponentPropsWithRef<"h2">;

export function H2({ ref, className, children }: Readonly<Props>) {
  return (
    <h2
      ref={ref}
      className={cn("scroll-m-20 text-xl font-semibold tracking-tight", className)}
    >
      {children}
    </h2>
  );
}
