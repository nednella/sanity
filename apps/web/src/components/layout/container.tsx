import { cn } from "@/lib/ui/utils"

type Props = React.ComponentPropsWithoutRef<"div">

export function Container({ className, ...props }: Readonly<Props>) {
    return (
        <div
            className={cn("container mx-auto px-4", className)}
            {...props}
        />
    )
}
