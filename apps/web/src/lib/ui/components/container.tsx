import React from "react"

import { cn } from "@/lib/ui/utils.ts"

type Props = React.ComponentPropsWithoutRef<"section">

export function Container({ className, ...props }: Readonly<Props>) {
    return (
        <section
            className={cn("mx-auto max-w-7xl px-12", className)}
            {...props}
        />
    )
}
