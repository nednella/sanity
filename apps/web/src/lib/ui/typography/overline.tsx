import { cn } from "cn";

type Props = React.ComponentPropsWithRef<"span">;

export function Overline({ ref, className, children }: Readonly<Props>) {
  return (
    <span
      className={cn("block text-[0.65rem] font-medium tracking-widest text-muted-foreground uppercase", className)}
      ref={ref}
    >
      {children}
    </span>
  );
}
