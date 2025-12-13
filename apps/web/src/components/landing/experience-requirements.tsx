import { motion } from "motion/react"

import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { LabelledSeparator, Separator } from "@/lib/ui/components/separator"
import { H3 } from "@/lib/ui/components/typography/h3"
import { Muted } from "@/lib/ui/components/typography/muted"

import { ItemGrid } from "../layout/item-grid"

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
}

const MContainer = motion.create(Container)
const MH3 = motion.create(H3)
const MMuted = motion.create(Muted)

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
            <MContainer
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center xl:max-w-5xl"
            >
                <Separator className="mb-24" />
                <MH3
                    variants={itemVariants}
                    className="mb-2"
                >
                    Expected Experience
                </MH3>
                <MMuted
                    variants={itemVariants}
                    className="mb-8 text-lg"
                >
                    we also maintain a minimum expected competency to participate in group-based content with our
                    members — we give you the option of applying with a minimum amount of raids experience, or
                    completion of various master tier diary times for those who might be lacking in volume but show
                    exceptional ability.
                </MMuted>
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
                        <motion.div
                            variants={itemVariants}
                            className="bg-background hover:border-foreground/20 flex size-20 items-center justify-center
                                rounded-full border transition-all duration-300 hover:shadow-md"
                        >
                            <div
                                className="bg-muted flex size-full items-center justify-center rounded-full select-none"
                            >
                                <span className="text-3xl">📖</span>
                            </div>
                        </motion.div>
                        <MMuted
                            variants={itemVariants}
                            className="max-w-xs font-medium"
                        >
                            Submit four Sanity master diary times from at least two different categories
                        </MMuted>
                    </Container>
                </ItemGrid>
            </MContainer>
        </Section>
    )
}

type ExperienceCardProps = {
    item: Experience
}

function ExperienceCard({ item }: Readonly<ExperienceCardProps>) {
    const imagePath = `/requirements/raids/${item.fileName}.webp`

    return (
        <motion.div
            variants={itemVariants}
            className="flex max-w-36 flex-col items-center"
        >
            <div
                // className="group flex aspect-square max-w-64 items-center justify-center overflow-hidden rounded-2xl
                //     border p-3 shadow-md transition-all hover:scale-110 hover:shadow-xl lg:p-6"
                className="bg-muted hover:border-foreground/20 mb-2 flex aspect-square max-w-24 items-center
                    justify-center overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:shadow-md"
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
        </motion.div>
    )
}
