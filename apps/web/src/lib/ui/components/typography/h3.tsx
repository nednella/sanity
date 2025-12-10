import { cn } from "@/lib/ui/utils"

type Props = React.ComponentPropsWithRef<"h3">

export function H3({ ref, className, children }: Readonly<Props>) {
    return (
        <h3
            ref={ref}
            className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)}
        >
            {children}
        </h3>
    )
}
