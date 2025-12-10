import { createFileRoute } from "@tanstack/react-router"
import { ArrowRight, Crown, Shield, Star, Trophy, User } from "lucide-react"
import { type LucideIcon } from "lucide-react"

import { CardGrid } from "@/components/landing/card-grid"
import { TextWithImage } from "@/components/landing/text-with-image"
import { Hero } from "@/components/layout/hero"
import { NavbarSpacer } from "@/components/navigation/navbar-spacer"
import { Section } from "@/lib/ui/components/section"
import { H3 } from "@/lib/ui/components/typography/h3"
import { Muted } from "@/lib/ui/components/typography/muted"
import { P } from "@/lib/ui/components/typography/p"

export const Route = createFileRoute("/(app)/(public)/(landing)/ranks")({
    component: RanksPage
})

type Rank = {
    icon: LucideIcon
    name: string
    description: string
    requirements: string
}

const ranks: Rank[] = [
    {
        icon: User,
        name: "Member",
        description: "The starting rank for all new clan members.",
        requirements: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
        icon: Star,
        name: "Veteran",
        description: "Achieved through consistent activity and participation.",
        requirements: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
        icon: Shield,
        name: "Elite",
        description: "For members who have demonstrated exceptional skill and dedication.",
        requirements: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
        icon: Trophy,
        name: "Champion",
        description: "Reserved for the most accomplished members of the clan.",
        requirements: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
        icon: Crown,
        name: "Master",
        description: "The highest achievable rank, representing true mastery.",
        requirements: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    }
]

const progressFeatures = [
    {
        title: "Earn Points",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
        title: "Participate in Events",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
        title: "Submit Achievements",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
        title: "Community Engagement",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    }
]

function RanksPage() {
    return (
        <>
            <NavbarSpacer />

            <Hero
                title="Ranking System"
                description="Understand how our ranking system works and how to progress through the ranks from Member to Master."
                className="my-24"
            />

            <Section className="mb-24">
                <TextWithImage
                    title="How Ranking Works"
                    imageSrc=""
                    imageAlt=""
                >
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
                </TextWithImage>
            </Section>

            <Section className="mb-24">
                <H3 className="mb-6">Available Ranks</H3>
                <div className="space-y-4">
                    {ranks.map((rank, index) => (
                        <RankCard
                            key={rank.name}
                            icon={rank.icon}
                            name={rank.name}
                            description={rank.description}
                            requirements={rank.requirements}
                            showArrow={index < ranks.length - 1}
                        />
                    ))}
                </div>
            </Section>

            <Section className="mb-24">
                <CardGrid
                    title="How to Progress"
                    cards={progressFeatures}
                    columns={2}
                />
            </Section>

            <Section className="mb-24">
                <TextWithImage
                    title="Rank Benefits"
                    imageSrc=""
                    imageAlt=""
                    flipContent
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
                </TextWithImage>
            </Section>
        </>
    )
}

type RankCardProps = {
    icon: LucideIcon
    name: string
    description: string
    requirements: string
    showArrow?: boolean
}

function RankCard({ icon: Icon, name, description, requirements, showArrow = false }: Readonly<RankCardProps>) {
    return (
        <div className="bg-card hover:border-foreground/20 group rounded-2xl border p-6 transition-all">
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
                <div className="bg-accent flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                    <Icon className="text-foreground size-6" />
                </div>
                <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                        <H3 className="text-xl">{name}</H3>
                        {showArrow && (
                            <ArrowRight
                                className="text-muted-foreground hidden size-4 transition-transform
                                    group-hover:translate-x-1 md:block"
                            />
                        )}
                    </div>
                    <Muted className="mb-3 block">{description}</Muted>
                    <div className="bg-muted/50 rounded-lg p-3">
                        <Muted className="text-xs font-medium tracking-wider uppercase">Requirements</Muted>
                        <p className="mt-1 text-sm">{requirements}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
