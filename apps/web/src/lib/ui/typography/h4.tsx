import { cn } from "cn";

type Props = React.ComponentPropsWithRef<"h4">;

export function H4({ ref, className, children }: Readonly<Props>) {
  return (
    <h4
      className={cn("text-xs font-semibold tracking-wide text-base-content/60 uppercase", className)}
      ref={ref}
    >
      {children}
    </h4>
  );
}
