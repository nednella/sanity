import { cn } from "@/lib/ui/utils"

type Props = React.ComponentPropsWithRef<"p">

export function P({ ref, className, children }: Readonly<Props>) {
    return (
        <p
            ref={ref}
            className={cn("leading-7 not-first:mt-6", className)}
        >
            {children}
        </p>
    )
}
