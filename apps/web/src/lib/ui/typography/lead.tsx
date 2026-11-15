import { cn } from "@/lib/ui/utils";

type Props = React.ComponentPropsWithRef<"p">;

export function Lead({ ref, className, children }: Readonly<Props>) {
  return (
    <p
      className={cn("text-xl text-base-content/60", className)}
      ref={ref}
    >
      {children}
    </p>
  );
}
