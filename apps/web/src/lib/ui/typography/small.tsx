import { cn } from "cn";

type Props = React.ComponentPropsWithRef<"small">;

export function Small({ ref, className, children }: Readonly<Props>) {
  return (
    <small
      className={cn("text-sm leading-none font-medium", className)}
      ref={ref}
    >
      {children}
    </small>
  );
}
