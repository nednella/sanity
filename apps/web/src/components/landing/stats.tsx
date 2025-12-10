import { Gauge, HandCoins, type LucideIcon, Timer, Users } from "lucide-react"
import { motion } from "motion/react"

import { Section } from "@/lib/ui/components/section"
import { H3 } from "@/lib/ui/components/typography/h3"
import { Lead } from "@/lib/ui/components/typography/lead"
import { Muted } from "@/lib/ui/components/typography/muted"

type Stat = {
    icon: LucideIcon
    label: string
    value: string
}

const stats: Stat[] = [
    { icon: Users, label: "Active Members", value: "180+" },
    { icon: Timer, label: "World Record Times", value: "15+" },
    { icon: Gauge, label: "Total Clan EHB", value: "550k+" },
    { icon: HandCoins, label: "Total Loot Value", value: "1.4t+" }
]

export function Stats() {
    return (
        <Section className="max-w-3xl py-24 text-center">
            <motion.div
                viewport={{ once: true }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.1 }}
            >
                <H3 className="mb-1">Clan Stats</H3>
                <Lead className="text-md mb-8">Our community at a glance.</Lead>
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="group"
                        >
                            <div
                                className="bg-background group-hover:border-foreground/20 mb-4 inline-flex rounded-xl
                                    border p-3 transition-all"
                            >
                                <stat.icon className="text-foreground size-6" />
                            </div>
                            <H3 className="mb-1">{stat.value}</H3>
                            <Muted>{stat.label}</Muted>
                        </div>
                    ))}
                </div>
            </motion.div>
        </Section>
    )
}
