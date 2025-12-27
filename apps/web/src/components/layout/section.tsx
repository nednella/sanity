import React from "react"

import { cn } from "@/lib/ui/utils.ts"

type Props = React.ComponentPropsWithoutRef<"section">

export function Section({ className, ...props }: Readonly<Props>) {
    return (
        <section
            className={cn("", className)}
            {...props}
        ></section>
    )
}
