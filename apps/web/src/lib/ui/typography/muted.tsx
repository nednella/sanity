import { cn } from "cn";

type Props = React.ComponentPropsWithRef<"p">;

export function Muted({ ref, className, children }: Readonly<Props>) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      ref={ref}
    >
      {children}
    </p>
  );
}
