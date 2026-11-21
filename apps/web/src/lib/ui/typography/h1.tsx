import { cn } from "@/lib/ui/utils";

type Props = React.ComponentPropsWithRef<"h1">;

export function H1({ ref, className, children }: Readonly<Props>) {
  return (
    <h1
      className={cn(
        `
          scroll-m-20 text-center text-2xl font-bold tracking-tight text-balance
          sm:text-4xl
        `,
        className
      )}
      ref={ref}
    >
      {children}
    </h1>
  );
}
