import { createFileRoute } from "@tanstack/react-router"

import { CardGrid } from "@/components/landing/card-grid"
import { TextWithImage } from "@/components/landing/text-with-image"
import { Hero } from "@/components/layout/hero"
import { NavbarSpacer } from "@/components/navigation/navbar-spacer"
import { Section } from "@/lib/ui/components/section"
import { H3 } from "@/lib/ui/components/typography/h3"
import { Muted } from "@/lib/ui/components/typography/muted"
import { P } from "@/lib/ui/components/typography/p"

export const Route = createFileRoute("/(app)/(public)/(landing)/about")({
    component: AboutPage
})

const summaries = [
    { description: "Established", title: "2015" },
    { description: "Active Members", title: "180+" },
    { description: "Home World", title: "364" },
    { description: "In-game Clan Chat", title: "Sanity" }
]

const features = [
    {
        title: "PvM Focus",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt."
    },
    {
        title: "Community Events",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt."
    },
    {
        title: "Competitive Play",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt."
    },
    {
        title: "Member Support",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt."
    }
]

function AboutPage() {
    return (
        <>
            <NavbarSpacer />
            <Hero
                title="Clan Background"
                description="Learn about Sanity's history, community, and what makes us one of the premier PvM clans in Old School RuneScape."
                className="my-24"
            />

            <Section className="mb-24">
                <TextWithImage
                    title="About us"
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

            <Section className="mb-24 max-w-4xl">
                <H3 className="mb-6">About Us</H3>
                <P>
                    Founded in 2015 by Castiyel and Adam R Pro, Sanity is an ex-warring clan turned PvM with an active
                    and tight-knit community within Old School RuneScape.
                </P>
                <P>We host a diverse group of players ranging from speedrunners to pet hunters to completionists.</P>
                <P>
                    We maintain a minimum barrier to entry which ensures our members are particularly competent at all
                    endgame PvM content that OSRS has to offer.
                </P>
                <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                    {summaries.map((item) => (
                        <div
                            key={item.title}
                            className="bg-card hover:border-foreground/20 flex flex-col rounded-2xl border p-4 shadow-sm
                                transition-all md:p-6"
                        >
                            <H3 className="mb-2">{item.title}</H3>
                            <Muted className="mt-auto">{item.description}</Muted>
                        </div>
                    ))}
                </div>
            </Section>

            <Section className="mb-24">
                <CardGrid
                    title="What We Do"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua."
                    cards={features}
                    columns={2}
                />
            </Section>

            <Section className="mb-24">
                <TextWithImage
                    title="Our community"
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
                        pariatur.
                    </P>
                </TextWithImage>
            </Section>

            <Section className="mb-24">
                <H3 className="mb-6">Council Members</H3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((index) => (
                        <div
                            key={index}
                            className="bg-card hover:border-foreground/20 rounded-2xl border p-6 text-center
                                transition-all"
                        >
                            <div className="bg-muted mx-auto mb-4 h-20 w-20 rounded-full" />
                            <H3 className="mb-1 text-lg">Council Member {index}</H3>
                            <Muted className="text-sm">Role Title</Muted>
                        </div>
                    ))}
                </div>
            </Section>
        </>
    )
}
