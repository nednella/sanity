import { Crown, type LucideIcon, Timer, Trophy, Users } from "lucide-react"

import { Container } from "@/lib/ui/components/container"

type Stat = {
    icon: LucideIcon
    label: string
    value: string
}

const stats: Stat[] = [
    { icon: Users, label: "Active Members", value: "500+" },
    { icon: Trophy, label: "Total Completions", value: "10K+" },
    { icon: Crown, label: "Master Ranks", value: "50+" },
    { icon: Timer, label: "Record Times", value: "100+" }
]

export function Stats() {
    return (
        <Container className="py-32 text-center">
            <div className="mb-20">
                <h2 className="mb-4 text-slate-200">What We Offer</h2>
                <p className="mx-auto max-w-2xl text-slate-400">
                    Experience competitive PVM with comprehensive tracking, rankings, and a thriving community
                </p>
            </div>
            <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="group relative"
                    >
                        <div
                            className="absolute inset-0 rounded-xl bg-linear-to-r from-cyan-500/0 via-cyan-500/10
                                to-cyan-500/0 opacity-0 blur-xl transition-opacity group-hover:opacity-100"
                        />
                        <div
                            className="relative rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm
                                transition-colors hover:border-cyan-500/30"
                        >
                            <stat.icon className="mx-auto mb-3 size-8 text-cyan-400" />
                            <div className="mb-1 text-2xl text-white">{stat.value}</div>
                            <div className="text-sm text-slate-500">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>
        </Container>
    )
}
