import { Link } from "@tanstack/react-router"
import { ArrowRight, Crown, type LucideIcon, Timer, Trophy, Users } from "lucide-react"

import { Container } from "@/lib/ui/components/container"

type Highlight = {
    title: string
    description: string
    link: string
    icon: LucideIcon
    gradient: string
}

const highlights: Highlight[] = [
    {
        title: "Achievement Diaries",
        description: "Track your speedrunning times across raids and bosses. Compete for master tier completions.",
        link: "/diary-times",
        icon: Timer,
        gradient: "from-cyan-500 to-blue-500"
    },
    {
        title: "Prestige Rankings",
        description: "Climb through 8 ranks from Member to Master. Earn points and unlock exclusive perks.",
        link: "/ranks",
        icon: Crown,
        gradient: "from-purple-500 to-pink-500"
    },
    {
        title: "Member Leaderboards",
        description: "View detailed stats, compare achievements, and track your progression against the best.",
        link: "/members",
        icon: Trophy,
        gradient: "from-orange-500 to-red-500"
    },
    {
        title: "Personal Bests",
        description: "Submit and showcase your fastest completion times. Push for better records.",
        link: "/submitted-pbs",
        icon: Timer,
        gradient: "from-green-500 to-emerald-500"
    },
    {
        title: "Loot Tracking",
        description: "Share your epic drops and rare achievements with the community.",
        link: "/submitted-loot",
        icon: Trophy,
        gradient: "from-yellow-500 to-orange-500"
    },
    {
        title: "Community Events",
        description: "Participate in clan competitions, group raids, and special challenges.",
        link: "/about",
        icon: Users,
        gradient: "from-blue-500 to-cyan-500"
    }
]

export function Highlights() {
    return (
        <Container className="py-24 text-center">
            <div className="mx-auto max-w-7xl">
                <div className="mb-16 text-center transition-all duration-1000">
                    <h2 className="text-foreground mb-4 text-3xl md:text-5xl">Highlights</h2>
                    <p className="text-muted-foreground mx-auto max-w-2xl">
                        [Placeholder: Brief description of what makes Sanity unique]
                    </p>
                </div>

                <div className="grid gap-6 transition-all delay-200 duration-1000 md:grid-cols-2 lg:grid-cols-3">
                    {highlights.map((hl) => (
                        <Link
                            key={hl.title}
                            to={hl.link}
                            className="group bg-background border-border hover:border-foreground/20 relative mx-auto
                                max-w-md rounded-2xl border p-6 transition-all"
                        >
                            <div className="mb-4">
                                <div className="bg-accent inline-flex rounded-lg p-2">
                                    <hl.icon className="text-foreground size-5" />
                                </div>
                            </div>

                            <h3 className="text-foreground mb-2">{hl.title}</h3>

                            <p className="text-muted-foreground mb-4 text-sm">{hl.description}</p>

                            <div
                                className="text-foreground/70 group-hover:text-foreground flex items-center text-sm
                                    transition-colors"
                            >
                                <span>View</span>
                                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </Container>
    )
}
