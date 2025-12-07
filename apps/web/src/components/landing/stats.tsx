import { Gauge, HandCoins, type LucideIcon, Timer, Users } from "lucide-react"
import { motion } from "motion/react"

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
    { icon: Users, label: "Active Members", value: "180+" },
    { icon: Timer, label: "World Record Times", value: "15+" },
    { icon: Gauge, label: "Total Clan EHB", value: "550k+" },
    { icon: HandCoins, label: "Total Loot Value", value: "1.4t+" }
]

export function Stats() {
    return (
        <Container className="max-w-5xl py-24 text-center">
            <motion.div
                viewport={{ once: true, margin: "-100px" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <H3 className="mb-2 text-3xl">Clan Statistics</H3>
                <Lead className="mb-12 text-lg">
                    Our community at a glance.
                </Lead>
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            viewport={{ once: true }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="bg-background hover:border-foreground/30 hover:shadow-md mb-4 inline-flex rounded-2xl border p-4 transition-all duration-300">
                                <stat.icon className="text-foreground size-6 transition-transform group-hover:scale-110" />
                            </div>
                            <H3 className="mb-1">{stat.value}</H3>
                            <Muted>{stat.label}</Muted>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </Container>
    )
}
