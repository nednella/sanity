import { cn } from "@/lib/ui/utils";

type Props = React.ComponentPropsWithRef<"span">;

export function Overline({ ref, className, children }: Readonly<Props>) {
  return (
    <span
      className={cn("block text-[0.65rem] font-medium tracking-widest text-base-content/50 uppercase", className)}
      ref={ref}
    >
      {children}
    </span>
  );
}
