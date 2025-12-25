import { Link, createFileRoute } from "@tanstack/react-router"
import { BookOpen, CalendarDays, Crown, HandCoins, type LucideIcon, Medal, Timer } from "lucide-react"

import { CallToAction } from "@/components/landing/call-to-action"
import { Container } from "@/components/layout/container"
import { Hero } from "@/components/layout/hero"
import { ItemGrid } from "@/components/layout/item-grid"
import { Section } from "@/components/layout/section"
import { TextWithImage } from "@/components/layout/text-with-image"
import { NavbarSpacer } from "@/components/navigation/navbar-spacer"
import { Card } from "@/lib/ui/components/card"
import { H3 } from "@/lib/ui/components/typography/h3"
import { Large } from "@/lib/ui/components/typography/large"
import { Muted } from "@/lib/ui/components/typography/muted"
import { P } from "@/lib/ui/components/typography/p"

export const Route = createFileRoute("/(app)/(public)/about")({
    component: AboutPage
})

type Stat = {
    label: string
    value: string
}

type Official = {
    avatarSrc: string
    roleSrc: string
    name: string
    role: string
}

type Highlight = {
    icon: LucideIcon
    title: string
    description: string
    to: string
}

const about: Stat[] = [
    { label: "Established", value: "2015" },
    { label: "Active Members", value: "300+" },
    { label: "Home World", value: "364" },
    { label: "Clan Chat", value: "Sanity" }
]

const community: Stat[] = [
    { label: "World Records", value: "15+" },
    { label: "Max Capes", value: "190+" },
    { label: "Total Clan EHB", value: "550k+" },
    { label: "Total Loot Value", value: "1.4t+" }
]

const officials: Official[] = [
    {
        avatarSrc: "",
        roleSrc: "",
        name: "Boxedup",
        role: "Owner"
    },
    {
        avatarSrc: "",
        roleSrc: "",
        name: "Sabfas",
        role: "Council"
    },
    {
        avatarSrc: "",
        roleSrc: "",
        name: "Sleep",
        role: "Council"
    },
    {
        avatarSrc: "",
        roleSrc: "",
        name: "Picuu",
        role: "Council"
    },
    {
        avatarSrc: "",
        roleSrc: "",
        name: "Council Member 5",
        role: "Council"
    },
    {
        avatarSrc: "",
        roleSrc: "",
        name: "Council Member 6",
        role: "Council"
    }
]

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

function AboutPage() {
    return (
        <>
            <NavbarSpacer />
            <Hero
                title="Clan Background"
                description="learn more about who we are"
                className="pt-36 pb-24"
                reduceMotion
            />

            {/* about */}
            <Section className="pb-24">
                <Container>
                    <TextWithImage
                        title="About us"
                        imageSrc=""
                        imageAlt=""
                    >
                        <P>
                            Founded in 2025 by Castiyel and Adam R Pro, Sanity is an ex-warring clan turned PvM with an
                            active and tight-knit community within Old School RuneScape.
                        </P>
                        <ItemGrid
                            cols="grid-cols-2 sm:grid-cols-4"
                            className="mt-6"
                        >
                            {about.map((item) => (
                                <Card key={item.label}>
                                    <H3 className="mb-1 text-xl">{item.value}</H3>
                                    <Muted className="mt-auto">{item.label}</Muted>
                                </Card>
                            ))}
                        </ItemGrid>
                    </TextWithImage>
                </Container>
            </Section>

            {/* community */}
            <Section className="pb-24">
                <Container>
                    <TextWithImage
                        title="Our community"
                        imageSrc=""
                        imageAlt=""
                        flipContent
                    >
                        <P>
                            We host a diverse group of exceptional players, ranging from speedrunners to pet hunters and
                            completionists.
                        </P>
                        <ItemGrid
                            cols="grid-cols-2 sm:grid-cols-4"
                            className="mt-6"
                        >
                            {community.map((item) => (
                                <Card key={item.label}>
                                    <H3 className="mb-1 text-xl">{item.value}</H3>
                                    <Muted className="mt-auto">{item.label}</Muted>
                                </Card>
                            ))}
                        </ItemGrid>
                    </TextWithImage>
                </Container>
            </Section>

            {/* council */}
            <Section className="pb-24">
                <Container>
                    <H3 className="mb-6">Clan officials</H3>
                    <ItemGrid
                        cols="sm:grid-cols-2 lg:grid-cols-3"
                        className="lg:gap-6"
                    >
                        {officials.map((item) => (
                            <Card
                                key={item.name}
                                className="hover:border-foreground/20 p-0 transition-all hover:shadow-md"
                            >
                                {/* TODO: link to member profile */}
                                <Link
                                    to="/"
                                    className="flex flex-col items-center p-4 text-center"
                                >
                                    {/* TODO: avatar image */}
                                    <div className="bg-muted mb-4 size-20 rounded-full" />
                                    <div className="mb-1 flex items-center gap-2">
                                        <H3 className="text-lg">{item.name}</H3>
                                        {/* TODO: clan rank sprite */}
                                        <div className="bg-muted size-8 rounded-full" />
                                    </div>
                                    <Muted className="text-sm">{item.role}</Muted>
                                </Link>
                            </Card>
                        ))}
                    </ItemGrid>
                </Container>
            </Section>

            {/* highlights */}
            <Section className="pb-48">
                <Container>
                    <H3 className="mb-6">Clan highlights</H3>
                    <ItemGrid
                        cols="sm:grid-cols-2 lg:grid-cols-3"
                        className="lg:gap-6"
                    >
                        {highlights.map((item) => (
                            <Card
                                key={item.title}
                                className="group hover:border-foreground/20 p-0 transition-all hover:shadow-md"
                            >
                                <Link
                                    to={item.to}
                                    className="flex flex-col items-center p-4 text-center"
                                >
                                    <div
                                        className="bg-accent hover:bg-accent/80 mb-4 inline-flex self-center rounded-xl
                                            border p-3 transition-colors"
                                    >
                                        <item.icon
                                            className="text-foreground size-5 transition-transform
                                                group-hover:scale-110"
                                        />
                                    </div>
                                    <Large className="mb-2">{item.title}</Large>
                                    <Muted className="mb-4">{item.description}</Muted>
                                </Link>
                            </Card>
                        ))}
                    </ItemGrid>
                </Container>
            </Section>

            <CallToAction />
        </>
    )
}
