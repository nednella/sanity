import { cn } from "@/lib/ui/utils"

type Props = React.ComponentPropsWithRef<"div">

export function Large({ ref, className, children }: Readonly<Props>) {
    return (
        <div
            ref={ref}
            className={cn("text-lg font-semibold", className)}
        >
            {children}
        </div>
    )
}
