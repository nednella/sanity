import { createFileRoute } from "@tanstack/react-router"
import { CheckCircle2 } from "lucide-react"

import { TextWithImage } from "@/components/landing/text-with-image"
import { Hero } from "@/components/layout/hero"
import { NavbarSpacer } from "@/components/navigation/navbar-spacer"
import { Section } from "@/lib/ui/components/section"
import { H3 } from "@/lib/ui/components/typography/h3"
import { Muted } from "@/lib/ui/components/typography/muted"
import { P } from "@/lib/ui/components/typography/p"

export const Route = createFileRoute("/(app)/(public)/(landing)/requirements")({
    component: RequirementsPage
})

type Requirement = {
    title: string
    description: string
}

const requirements: Requirement[] = [
    {
        title: "Minimum Combat Level",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt."
    },
    {
        title: "Quest Requirements",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt."
    },
    {
        title: "PvM Experience",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt."
    },
    {
        title: "Activity Requirements",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt."
    }
]

const applicationSteps = [
    {
        number: 1,
        title: "Submit Application",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
        number: 2,
        title: "Review Process",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
        number: 3,
        title: "Trial Period",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
        number: 4,
        title: "Full Membership",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    }
]

function RequirementsPage() {
    return (
        <>
            <NavbarSpacer />

            <Hero
                title="Clan Requirements"
                description="Find out what it takes to join Sanity and become part of our elite PvM community."
                className="my-24"
            />

            <Section className="mb-24">
                <H3 className="mb-6">Entry Requirements</H3>
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-4">
                        {requirements.slice(0, 2).map((item) => (
                            <RequirementCard
                                key={item.title}
                                title={item.title}
                                description={item.description}
                            />
                        ))}
                    </div>
                    <div className="space-y-4">
                        {requirements.slice(2).map((item) => (
                            <RequirementCard
                                key={item.title}
                                title={item.title}
                                description={item.description}
                            />
                        ))}
                    </div>
                </div>
            </Section>

            <Section className="mb-24">
                <TextWithImage
                    title="Application Process"
                    imageSrc=""
                    imageAlt=""
                    flipContent
                >
                    <StepList steps={applicationSteps} />
                </TextWithImage>
            </Section>

            <Section className="mb-24">
                <H3 className="mb-4">Additional Information</H3>
                <P>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </P>
                <P>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur sint occaecat cupidatat non proident.
                </P>
            </Section>
        </>
    )
}

type RequirementCardProps = {
    title: string
    description: string
}

function RequirementCard({ title, description }: Readonly<RequirementCardProps>) {
    return (
        <div className="bg-card hover:border-foreground/20 rounded-2xl border p-6 transition-all">
            <div className="flex items-start gap-4">
                <div className="bg-primary/10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                    <CheckCircle2 className="text-primary size-5" />
                </div>
                <div className="flex-1">
                    <H3 className="mb-2 text-xl">{title}</H3>
                    <Muted>{description}</Muted>
                </div>
            </div>
        </div>
    )
}

type Step = {
    number: number
    title: string
    description: string
}

type StepListProps = {
    title?: string
    steps: Step[]
}

export function StepList({ title, steps }: Readonly<StepListProps>) {
    return (
        <div>
            {title && <H3 className="mb-6">{title}</H3>}
            <div className="space-y-6">
                {steps.map((step) => (
                    <div
                        key={step.number}
                        className="flex gap-4"
                    >
                        <div
                            className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center
                                justify-center rounded-full font-bold"
                        >
                            {step.number}
                        </div>
                        <div className="flex-1">
                            <H3 className="mb-2 text-lg">{step.title}</H3>
                            <Muted>{step.description}</Muted>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
