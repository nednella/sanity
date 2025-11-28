import { Crown, type LucideIcon, Timer, Trophy, Users } from "lucide-react"

import { Container } from "@/lib/ui/components/container"

type Stat = {
    icon: LucideIcon
    label: string
    value: string
}

const stats: Stat[] = [
    { icon: Users, label: "Active Members", value: "250+" },
    { icon: Trophy, label: "Total Clan EHB", value: "550K+" },
    { icon: Crown, label: "Master Ranks", value: "50+" },
    { icon: Timer, label: "Record Times", value: "100+" }
]

export function Stats() {
    return (
        <Container className="py-24 text-center">
            <div className="mx-auto max-w-4xl">
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="text-center"
                        >
                            <div className="bg-accent/50 border-border mb-4 inline-flex rounded-xl border p-3">
                                <stat.icon className="text-foreground size-6" />
                            </div>
                            <div className="text-foreground mb-1 text-3xl">{stat.value}</div>
                            <div className="text-muted-foreground text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </Container>
    )
}
