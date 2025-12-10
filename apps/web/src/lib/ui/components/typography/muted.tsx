import { cn } from "@/lib/ui/utils"

type Props = React.ComponentPropsWithRef<"p">

export function Muted({ ref, className, children }: Readonly<Props>) {
    return (
        <p
            ref={ref}
            className={cn("text-muted-foreground text-sm", className)}
        >
            {children}
        </p>
    )
}
