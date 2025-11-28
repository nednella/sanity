import { Link } from "@tanstack/react-router"
import { ArrowRight, Crown, type LucideIcon, Timer, Trophy, Users } from "lucide-react"

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
        icon: Timer,
        title: "Achievement Diaries",
        description: "Track your speedrunning times across raids and bosses. Compete for master tier completions.",
        to: "/diary-times"
    },
    {
        icon: Crown,
        title: "Prestige Rankings",
        description: "Climb through 8 ranks from Member to Master. Earn points and unlock exclusive perks.",
        to: "/ranks"
    },
    {
        icon: Trophy,
        title: "Member Leaderboards",
        description: "View detailed stats, compare achievements, and track your progression against the best.",
        to: "/members"
    },
    {
        icon: Timer,
        title: "Personal Bests",
        description: "Submit and showcase your fastest completion times. Push for better records.",
        to: "/submitted-pbs"
    },
    {
        icon: Trophy,
        title: "Loot Tracking",
        description: "Share your epic drops and rare achievements with the community.",
        to: "/submitted-loot"
    },
    {
        icon: Users,
        title: "Community Events",
        description: "Participate in clan competitions, group raids, and special challenges.",
        to: "/about"
    }
]

export function Highlights() {
    return (
        <Container className="py-24 text-center">
            <H3 className="mb-1">Membership Perks</H3>
            <Lead className="text-md mb-12">[Placeholder: Brief description of what makes Sanity unique]</Lead>
            <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
                {highlights.map((hl) => (
                    <Link
                        key={hl.title}
                        to={hl.to}
                        className="group bg-background hover:border-foreground/20 relative mx-auto max-w-md rounded-2xl
                            border p-6 transition-all"
                    >
                        <div className="bg-accent mb-4 inline-flex rounded-xl border p-3">
                            <hl.icon className="text-foreground size-5" />
                        </div>
                        <Large className="mb-2">{hl.title}</Large>
                        <Muted className="mb-4">{hl.description}</Muted>
                        <div className="text-foreground/80 group-hover:text-foreground flex items-center">
                            <Small>View</Small>
                            <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                        </div>
                    </Link>
                ))}
            </div>
        </Container>
    )
}
