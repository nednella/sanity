import { cn } from "@/lib/ui/utils"

type Props = React.ComponentPropsWithRef<"h1">

export function H1({ ref, className, children }: Readonly<Props>) {
    return (
        <h1
            ref={ref}
            className={cn("scroll-m-20 text-center text-4xl font-bold tracking-tight text-balance", className)}
        >
            {children}
        </h1>
    )
}
