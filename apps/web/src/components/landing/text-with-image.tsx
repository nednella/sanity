import React from "react"

import { H3 } from "@/lib/ui/components/typography/h3"
import { cn } from "@/lib/ui/utils.ts"

type Props = {
    title: string
    children: React.ReactNode
    imageSrc: string
    imageAlt: string
    flipContent?: boolean
    className?: string
}

export function TextWithImage({
    title,
    children,
    imageSrc,
    imageAlt,
    flipContent = false,
    className
}: Readonly<Props>) {
    const imageElement = imageSrc ? (
        <img
            src={imageSrc}
            alt={imageAlt}
            className="rounded-2xl"
        />
    ) : (
        <div className="bg-muted aspect-video rounded-2xl" />
    )

    return (
        <div className={cn("grid gap-8 lg:grid-cols-2 lg:items-center", className)}>
            {flipContent ? (
                <>
                    <div className="order-2 lg:order-1">{imageElement}</div>
                    <div className="order-1 lg:order-2">
                        <H3 className="mb-4">{title}</H3>
                        {children}
                    </div>
                </>
            ) : (
                <>
                    <div>
                        <H3 className="mb-4">{title}</H3>
                        {children}
                    </div>
                    <div>{imageElement}</div>
                </>
            )}
        </div>
    )
}
