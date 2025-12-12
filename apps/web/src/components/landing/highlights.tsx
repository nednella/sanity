import { Link } from "@tanstack/react-router"
import { ArrowRight, BookOpen, CalendarDays, Crown, HandCoins, type LucideIcon, Medal, Timer } from "lucide-react"
import { motion } from "motion/react"

import { Section } from "@/lib/ui/components/section"
import { H3 } from "@/lib/ui/components/typography/h3"
import { Large } from "@/lib/ui/components/typography/large"
import { Muted } from "@/lib/ui/components/typography/muted"
import { Small } from "@/lib/ui/components/typography/small"

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
const MLink = motion.create(Link)

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
        <MSection
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-48 text-center"
        >
            <MH3
                variants={itemVariants}
                className="mb-2"
            >
                Membership Perks
            </MH3>
            <MMuted
                variants={itemVariants}
                className="mb-8 text-lg"
            >
                discover what makes Sanity one of the premier PvM clans in Old School RuneScape.
            </MMuted>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {highlights.map((hl) => (
                    <MLink
                        variants={itemVariants}
                        key={hl.title}
                        to={hl.to}
                        className="group bg-background hover:border-foreground/20 mx-auto flex h-full max-w-md flex-col
                            rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg"
                    >
                        <div
                            className="bg-accent hover:bg-accent/80 mb-4 inline-flex self-center rounded-xl border p-3
                                transition-colors"
                        >
                            <hl.icon className="text-foreground size-5 transition-transform group-hover:scale-110" />
                        </div>
                        <Large className="mb-2">{hl.title}</Large>
                        <Muted className="mb-4">{hl.description}</Muted>
                        <div
                            className="text-muted-foreground group-hover:text-foreground mt-auto flex items-center
                                justify-center transition-colors"
                        >
                            <Small>Learn more</Small>
                            <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                        </div>
                    </MLink>
                ))}
            </div>
        </MSection>
    )
}
