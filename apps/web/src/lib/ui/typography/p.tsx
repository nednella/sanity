import { cn } from "cn";

type Props = React.ComponentPropsWithRef<"p">;

export function P({ ref, className, children }: Readonly<Props>) {
  return (
    <p
      className={cn("leading-7", className)}
      ref={ref}
    >
      {children}
    </p>
  );
}
