import { cn } from "@/lib/ui/utils"

interface Props {
    className?: string
    children: React.ReactNode
}

export function P({ className, children }: Readonly<Props>) {
    return <p className={cn("leading-7 not-first:mt-6", className)}>{children}</p>
}
