import { cn } from "@/lib/ui/utils"

type Props = React.ComponentPropsWithRef<"p">

export function Lead({ ref, className, children }: Readonly<Props>) {
    return (
        <p
            ref={ref}
            className={cn("text-muted-foreground text-xl", className)}
        >
            {children}
        </p>
    )
}
