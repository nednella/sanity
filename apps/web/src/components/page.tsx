import React from "react"

import { cn } from "@/lib/ui/utils"

type Props = React.ComponentPropsWithoutRef<"div">

export function Page({ className, ...props }: Readonly<Props>) {
    return (
        <div
            className={cn("flex min-h-screen flex-col", className)}
            {...props}
        />
    )
}
