import { Link } from "@tanstack/react-router"
import { ArrowRight, Crown, type LucideIcon, Timer, Trophy, Users } from "lucide-react"

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
        <section className="container mx-auto py-32 text-center">
            <div className="mb-20">
                <h2 className="mb-4 text-slate-200">What We Offer</h2>
                <p className="mx-auto max-w-2xl text-slate-400">
                    Experience competitive PVM with comprehensive tracking, rankings, and a thriving community
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {highlights.map((hl) => (
                    <Link
                        key={hl.title}
                        to={hl.link}
                        className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50
                            p-8 backdrop-blur-sm transition-all hover:border-slate-700"
                    >
                        <div
                            className={`absolute inset-0 bg-linear-to-br ${hl.gradient} opacity-0 transition-opacity
                            group-hover:opacity-5`}
                        />

                        <div className="relative z-10">
                            <div
                                className={`inline-flex rounded-xl bg-linear-to-br p-3 ${hl.gradient} bg-opacity-10
                                mb-6`}
                            >
                                <hl.icon className="size-6 text-cyan-400" />
                            </div>

                            <h3 className="mb-3 text-xl text-slate-200 transition-colors group-hover:text-white">
                                {hl.title}
                            </h3>

                            <p className="mb-4 text-slate-400">{hl.description}</p>

                            <div className="flex items-center text-cyan-400 transition-colors group-hover:text-cyan-300">
                                <span className="text-sm">Explore</span>
                                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-2" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}
