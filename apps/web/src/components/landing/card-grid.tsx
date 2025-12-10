import React from "react"

import { motion } from "motion/react"

import { H3 } from "@/lib/ui/components/typography/h3"
import { Lead } from "@/lib/ui/components/typography/lead"
import { Muted } from "@/lib/ui/components/typography/muted"
import { cn } from "@/lib/ui/utils.ts"

type Card = {
    title: string
    description: string
    icon?: React.ReactNode
}

type CardGridProps = {
    title?: string
    description?: string
    cards: Card[]
    columns?: 2 | 3 | 4
    className?: string
}

const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4"
}

export function CardGrid({ title, description, cards, columns = 2, className }: Readonly<CardGridProps>) {
    const titleElement = title ? <H3 className={cn("mb-8", description && "mb-2")}>{title}</H3> : undefined
    const descriptionElement = description ? <Lead className="mb-8">{description}</Lead> : undefined

    return (
        <motion.div className={className}>
            {titleElement}
            {descriptionElement}
            <div className={cn("grid gap-4", gridCols[columns])}>
                {cards.map((card) => (
                    <div
                        key={card.title}
                        className="bg-card rounded-2xl border p-6"
                    >
                        {card.icon && <div className="mb-4">{card.icon}</div>}
                        <H3 className="mb-2 text-xl">{card.title}</H3>
                        <Muted>{card.description}</Muted>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}
