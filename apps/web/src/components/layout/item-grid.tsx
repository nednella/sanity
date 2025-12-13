import type React from "react"

import { cn } from "@/lib/ui/utils"

type ItemGridProps = React.ComponentPropsWithoutRef<"div"> & {
    cols?: string // default grid behaviour is the same as grid-cols-1
}

export function ItemGrid({ cols, className, children }: Readonly<ItemGridProps>) {
    return <div className={cn("grid gap-4", cols, className)}>{children}</div>
}
