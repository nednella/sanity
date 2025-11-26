import { cn } from "@/lib/ui/utils"

interface Props {
    className?: string
    children: React.ReactNode
}

export function Small({ className, children }: Readonly<Props>) {
    return <small className={cn("text-sm leading-none font-medium", className)}>{children}</small>
}
