import { Link } from "@tanstack/react-router"
import { ArrowRight, BookOpen, CalendarDays, Crown, HandCoins, type LucideIcon, Medal, Timer } from "lucide-react"
import { motion } from "motion/react"

import { Container } from "@/lib/ui/components/container"
import { H3 } from "@/lib/ui/components/typography/h3"
import { Large } from "@/lib/ui/components/typography/large"
import { Lead } from "@/lib/ui/components/typography/lead"
import { Muted } from "@/lib/ui/components/typography/muted"
import { Small } from "@/lib/ui/components/typography/small"

type Highlight = {
    icon: LucideIcon
    title: string
    description: string
    to: string
}

const highlights: Highlight[] = [
    {
        icon: BookOpen,
        title: "Achievement Diary",
        description:
            "Compare your speedrunning times against our tracked content and work towards diary completionist.",
        to: "/diary-times"
    },
    {
        icon: Timer,
        title: "Personal Bests",
        description:
            "Submit your fastest completion times for tracked content and compare against our clan leaderboards.",
        to: "/submitted-pbs"
    },
    {
        icon: HandCoins,
        title: "Loot Tracking",
        description: "Submit your loot to gain membership points and progress through the ranks.",
        to: "/submitted-loot"
    },
    {
        icon: Crown,
        title: "Clan Rankings",
        description:
            "Climb through the ranks from Member to Master by engaging with the community and gaining clan points.",
        to: "/ranks"
    },
    {
        icon: Medal,
        title: "Member Leaderboards",
        description: "View detailed stats, compare achievements, and track your progression against the best.",
        to: "/members"
    },
    {
        icon: CalendarDays,
        title: "Community Events",
        description: "Participate in regular clan competitions, group raids, and special challenges.",
        to: "/about"
    }
]

export function Highlights() {
    return (
        <Container className="py-24 text-center">
            <motion.div
                viewport={{ once: true, margin: "-100px" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <H3 className="mb-2 text-3xl">Membership Perks</H3>
                <Lead className="text-lg mb-12">Discover what makes Sanity one of the premier PvM clans in Old School RuneScape.</Lead>
                <div className="grid gap-4 lg:gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {highlights.map((hl, index) => (
                        <motion.div
                            key={hl.title}
                            viewport={{ once: true }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Link
                                to={hl.to}
                                className="group bg-background hover:border-foreground/20 hover:shadow-lg mx-auto flex h-full max-w-md flex-col rounded-2xl border p-6 transition-all duration-300"
                            >
                                <div className="bg-accent hover:bg-accent/80 mb-4 inline-flex self-center rounded-xl border p-3 transition-colors">
                                    <hl.icon className="text-foreground size-5 transition-transform group-hover:scale-110" />
                                </div>
                                <Large className="mb-2">{hl.title}</Large>
                                <Muted className="mb-4 text-sm leading-relaxed">{hl.description}</Muted>
                                <div className="text-muted-foreground group-hover:text-foreground mt-auto flex items-center justify-center transition-colors">
                                    <Small className="font-medium">Learn more</Small>
                                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </Container>
    )
}
