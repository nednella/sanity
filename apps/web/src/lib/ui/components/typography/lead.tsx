import { cn } from "@/lib/ui/utils"

interface Props {
    className?: string
    children: React.ReactNode
}

export function Lead({ className, children }: Readonly<Props>) {
    return <p className={cn("text-muted-foreground text-xl", className)}>{children}</p>
}
