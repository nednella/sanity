import { createFileRoute } from "@tanstack/react-router"
import { Clock, TrendingUp, Trophy } from "lucide-react"

import { FeatureGrid } from "@/components/landing/card-grid"
import { TextImageSection } from "@/components/landing/text-with-image"
import { PageHero } from "@/components/layout/hero"
import { NavbarSpacer } from "@/components/navigation/navbar-spacer"
import { Section } from "@/lib/ui/components/section"
import { H3 } from "@/lib/ui/components/typography/h3"
import { Muted } from "@/lib/ui/components/typography/muted"
import { P } from "@/lib/ui/components/typography/p"

export const Route = createFileRoute("/(app)/(public)/(landing)/achievement-diary")({
    component: DiaryTimesPage
})

type DiaryCategory = {
    name: string
    description: string
    count: number
}

const diaryCategories: DiaryCategory[] = [
    {
        name: "Easy",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        count: 12
    },
    {
        name: "Medium",
        description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        count: 11
    },
    {
        name: "Hard",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        count: 11
    },
    {
        name: "Elite",
        description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
        count: 11
    }
]

const howItWorksFeatures = [
    {
        title: "Submit Times",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.",
        icon: (
            <div className="bg-primary/10 mb-4 inline-flex rounded-lg p-3">
                <Clock className="text-primary size-5" />
            </div>
        )
    },
    {
        title: "Track Progress",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.",
        icon: (
            <div className="bg-primary/10 mb-4 inline-flex rounded-lg p-3">
                <TrendingUp className="text-primary size-5" />
            </div>
        )
    },
    {
        title: "Compete",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.",
        icon: (
            <div className="bg-primary/10 mb-4 inline-flex rounded-lg p-3">
                <Trophy className="text-primary size-5" />
            </div>
        )
    }
]

function DiaryTimesPage() {
    return (
        <>
            <NavbarSpacer />

            <PageHero
                title="Achievement Diary Times"
                description="Compare your speedrunning times against our tracked content and work towards diary completionist status."
            />

            <Section>
                <TextImageSection title="About Achievement Diaries">
                    <P>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat.
                    </P>
                    <P>
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                        mollit anim id est laborum.
                    </P>
                </TextImageSection>
            </Section>

            <Section>
                <H3 className="mb-6">Diary Categories</H3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {diaryCategories.map((category) => (
                        <div
                            key={category.name}
                            className="bg-card hover:border-foreground/20 rounded-2xl border p-6 transition-all"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <H3 className="text-xl">{category.name}</H3>
                                <div className="bg-accent flex h-10 w-10 items-center justify-center rounded-lg">
                                    <Clock className="text-foreground size-5" />
                                </div>
                            </div>
                            <Muted className="mb-3 block">{category.description}</Muted>
                            <div className="bg-muted/50 rounded-lg p-3">
                                <Muted className="text-xs font-medium tracking-wider uppercase">Tracked Tasks</Muted>
                                <p className="mt-1 text-lg font-semibold">{category.count}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            <Section>
                <FeatureGrid
                    title="How It Works"
                    features={howItWorksFeatures}
                    columns={3}
                />
            </Section>

            <Section>
                <TextImageSection
                    title="Leaderboard Rankings"
                    imageFirst
                >
                    <P>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris.
                    </P>
                    <P>
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                        pariatur. Excepteur sint occaecat cupidatat non proident.
                    </P>
                </TextImageSection>
            </Section>
        </>
    )
}
