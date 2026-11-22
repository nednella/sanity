import { cn } from "cn";

type Props = React.ComponentPropsWithRef<"h3">;

export function H3({ ref, className, children }: Readonly<Props>) {
  return (
    <h3
      className={cn("scroll-m-20 text-lg font-semibold tracking-tight", className)}
      ref={ref}
    >
      {children}
    </h3>
  );
}
