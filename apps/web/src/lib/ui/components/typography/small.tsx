import { cn } from "@/lib/ui/utils"

type Props = React.ComponentPropsWithRef<"small">

export function Small({ ref, className, children }: Readonly<Props>) {
    return (
        <small
            ref={ref}
            className={cn("text-sm leading-none font-medium", className)}
        >
            {children}
        </small>
    )
}
