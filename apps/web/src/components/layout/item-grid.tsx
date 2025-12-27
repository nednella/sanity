import type React from "react"

import { cn } from "@/lib/ui/utils"

type ItemGridProps = React.ComponentPropsWithRef<"div"> & {
    cols?: string // default grid behaviour is equal to grid-cols-1
}

export function ItemGrid({ cols, className, ...props }: Readonly<ItemGridProps>) {
    return (
        <div
            className={cn("grid gap-4", cols, className)}
            {...props}
        />
    )
}
