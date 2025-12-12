import { Gauge, HandCoins, type LucideIcon, Timer, Users } from "lucide-react"
import { motion } from "motion/react"

import { Section } from "@/lib/ui/components/section"
import { H3 } from "@/lib/ui/components/typography/h3"
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

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } }
}

const MSection = motion.create(Section)
const MH3 = motion.create(H3)
const MMuted = motion.create(Muted)

export function Stats() {
    return (
        <MSection
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-48 max-w-4xl pt-48 text-center"
        >
            <>
                <MH3
                    variants={itemVariants}
                    className="mb-2"
                >
                    Clan Stats
                </MH3>
                <MMuted
                    variants={itemVariants}
                    className="mb-8 text-lg"
                >
                    our community at a glance.
                </MMuted>
                <div className="mx-auto grid max-w-sm grid-cols-2 gap-8 md:max-w-none md:grid-cols-4">
                    {stats.map((stat) => (
                        <motion.div
                            variants={itemVariants}
                            key={stat.label}
                            className="group"
                        >
                            <div
                                className="bg-background hover:border-foreground/30 mb-4 inline-flex rounded-2xl border
                                    p-4 transition-all duration-300 hover:shadow-md"
                            >
                                <stat.icon className="text-foreground size-6 transition-transform group-hover:scale-110" />
                            </div>
                            <H3 className="mb-1">{stat.value}</H3>
                            <Muted>{stat.label}</Muted>
                        </motion.div>
                    ))}
                </div>
            </>
        </MSection>
    )
}
