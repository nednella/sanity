import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { LabelledSeparator, Separator } from "@/lib/ui/components/separator"
import { H3 } from "@/lib/ui/components/typography/h3"
import { Muted } from "@/lib/ui/components/typography/muted"

import { ItemGrid } from "../layout/item-grid"

type Experience = {
    name: string
    fileName: string | undefined
    killCount: number
}

const experienceRequirements: Experience[] = [
    {
        name: "Chambers of Xeric (CM)",
        fileName: "chambers_of_xeric",
        killCount: 50
    },
    {
        name: "Theatre of Blood",
        fileName: "theatre_of_blood",
        killCount: 50
    },
    {
        name: "Tombs of Amascut (Expert)",
        fileName: "tombs_of_amascut",
        killCount: 50
    },
    {
        name: "Combined Raids",
        fileName: "raids",
        killCount: 500
    }
]

export function ExperienceRequirements() {
    return (
        <Section className="pb-48">
            <Container className="text-center xl:max-w-5xl">
                <Separator className="mb-24" />
                <H3 className="mb-2">Expected Experience</H3>
                <Muted className="mb-8 text-lg">
                    we also maintain a minimum expected competency to participate in group-based content with our
                    members — we give you the option of applying with a minimum amount of raids experience, or
                    completion of various master tier diary times for those who might be lacking in volume but show
                    exceptional ability.
                </Muted>
                <ItemGrid
                    cols="md:grid-cols-[1fr_max-content_1fr]"
                    className="gap-8"
                >
                    <ItemGrid
                        cols="grid-cols-4"
                        className="justify-items-center"
                    >
                        {experienceRequirements.map((requirement) => (
                            <ExperienceCard
                                key={requirement.name}
                                item={requirement}
                            />
                        ))}
                    </ItemGrid>

                    <Separator
                        orientation="vertical"
                        className="hidden md:block"
                    />
                    <LabelledSeparator
                        className="md:hidden"
                        childrenClassName="text-muted-foreground"
                    >
                        OR
                    </LabelledSeparator>

                    <Container className="flex flex-col items-center gap-4">
                        <div
                            className="bg-background hover:border-foreground/20 flex size-20 items-center justify-center
                                rounded-full border transition-all duration-300 hover:shadow-md"
                        >
                            <div
                                className="bg-muted flex size-full items-center justify-center rounded-full select-none"
                            >
                                <span className="text-3xl">📖</span>
                            </div>
                        </div>
                        <Muted className="max-w-xs font-medium">
                            Submit four Sanity master diary times from at least two different categories
                        </Muted>
                    </Container>
                </ItemGrid>
            </Container>
        </Section>
    )
}

type ExperienceCardProps = {
    item: Experience
}

function ExperienceCard({ item }: Readonly<ExperienceCardProps>) {
    const imagePath = `/requirements/raids/${item.fileName}.webp`

    return (
        <div className="flex max-w-36 flex-col items-center">
            <div
                className="bg-muted hover:border-foreground/20 mb-2 flex aspect-square max-w-24 items-center
                    justify-center overflow-hidden rounded-2xl border p-4 transition-all hover:shadow-md"
            >
                <img
                    src={imagePath}
                    alt={item.name}
                    className="size-full object-contain transition-transform select-none"
                    onError={(event) => {
                        const target = event.target as HTMLImageElement
                        target.style.display = "none"
                        const fallback = document.createElement("div")
                        fallback.className = "text-muted-foreground text-xs text-center"
                        fallback.textContent = item.name
                        target.parentElement?.append(fallback)
                    }}
                />
            </div>
            <Muted className="font-medium">
                {item.killCount} {item.name}
            </Muted>
        </div>
    )
}
