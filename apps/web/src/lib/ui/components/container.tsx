import React from "react"

import { cn } from "@/lib/ui/utils.ts"

interface Props extends React.ComponentPropsWithoutRef<"div"> {
    px?: "0" | "2" | "4" | "6" | "8"
}

const pxMap = {
    0: "",
    2: "p-2",
    4: "p-4",
    6: "p-6",
    8: "p-8"
} as const

export function Container({ className, px = "0", ...props }: Readonly<Props>) {
    return (
        <div
            className={cn("mx-auto w-full", pxMap[px], className)}
            {...props}
        />
    )
}
