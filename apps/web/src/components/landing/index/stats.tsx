import { Gauge, HandCoins, type LucideIcon, Timer, Users } from "lucide-react"

import { Container } from "@/lib/ui/components/container"
import { H3 } from "@/lib/ui/components/typography/h3"
import { Lead } from "@/lib/ui/components/typography/lead"
import { Muted } from "@/lib/ui/components/typography/muted"

type Stat = {
    icon: LucideIcon
    label: string
    value: string
}

const stats: Stat[] = [
    { icon: Users, label: "Active Members", value: "250+" },
    { icon: Gauge, label: "Total Clan EHB", value: "550k+" },
    { icon: HandCoins, label: "Total Loot Value", value: "1000b+" },
    { icon: Timer, label: "World Record Times", value: "15+" }
]

export function Stats() {
    return (
        <Container className="max-w-3xl py-24 text-center">
            <H3 className="mb-1">Clan Stats</H3>
            <Lead className="text-md mb-8">Our community at a glance</Lead>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
                {stats.map((stat) => (
                    <div key={stat.label}>
                        <div className="bg-background border-border mb-4 inline-flex rounded-xl border p-3">
                            <stat.icon className="text-foreground size-6" />
                        </div>
                        <H3 className="mb-1">{stat.value}</H3>
                        <Muted>{stat.label}</Muted>
                    </div>
                ))}
            </div>
        </Container>
    )
}
