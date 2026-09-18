import { cn } from "@/lib/ui/utils";

type CardProps = React.ComponentProps<"div">;

export function Card({ className, ...props }: Readonly<CardProps>) {
  return (
    <div
      className={cn("card rounded-2xl bg-base-100 p-4 shadow-sm card-border", className)}
      {...props}
    />
  );
}
