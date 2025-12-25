import { cn } from "@/lib/ui/utils"

type CardProps = React.ComponentPropsWithRef<"div">

export function Card({ className, ...props }: Readonly<CardProps>) {
    return (
        <div
            className={cn("bg-card rounded-2xl border p-4 shadow-sm", className)}
            {...props}
        />
    )
}
