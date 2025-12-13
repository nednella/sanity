import { motion } from "motion/react"

import { Container } from "@/components/layout/container"
import { ItemGrid } from "@/components/layout/item-grid"
import { Section } from "@/components/layout/section"
import { H3 } from "@/lib/ui/components/typography/h3"
import { Large } from "@/lib/ui/components/typography/large"
import { Muted } from "@/lib/ui/components/typography/muted"

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
    hidden: { opacity: 0, x: -25 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5 }
    }
}

const MContainer = motion.create(Container)
const MH3 = motion.create(H3)
const MMuted = motion.create(Muted)

type Step = {
    number: number
    title: string
    description: string
}

const steps: Step[] = [
    {
        number: 1,
        title: "Submit Application",
        description:
            "Join our Discord server and read through our public information. Here, you will find all information related to submitting an application."
    },
    {
        number: 2,
        title: "Review Process",
        description:
            "Our council members will review your application and verify that you meet all requirements. Once reviewed and approved, your application will be put in front of our star-ranked members, who will vote on approving your trial."
    },
    {
        number: 3,
        title: "Trial Period",
        description:
            "If approved, you'll enter a designated trial period where you can get get a feel for the clan itself. At this point, you should get to know your fellow members, attend activities and demonstrate your ability within the game. Throughout the trial, our members will leave feedback on their personal experiences with you."
    },
    {
        number: 4,
        title: "Full Membership",
        description: "If we're satisfied with your trial period, you'll be granted full membership."
    }
]

export function ApplicationProcess() {
    return (
        <Section className="pb-48">
            <MContainer
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="lg:max-w-4xl"
            >
                <MH3
                    variants={itemVariants}
                    className="mb-2 text-center"
                >
                    Application Process
                </MH3>
                <MMuted
                    variants={itemVariants}
                    className="mb-8 text-center text-lg"
                >
                    if you meet our requirements, here's what you can expect on your way to becoming a member.
                </MMuted>
                <ItemGrid className="gap-8">
                    {steps.map((step) => (
                        <StepCard
                            key={step.number}
                            step={step}
                        />
                    ))}
                </ItemGrid>
            </MContainer>
        </Section>
    )
}

type StepCardProps = {
    step: Step
}

function StepCard({ step }: Readonly<StepCardProps>) {
    return (
        <motion.div
            variants={itemVariants}
            className="group flex gap-4"
        >
            <div
                className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center
                    rounded-full font-bold transition-transform select-none group-hover:scale-110"
            >
                {step.number}
            </div>
            <div className="flex-1">
                <Large className="mb-2">{step.title}</Large>
                <Muted>{step.description}</Muted>
            </div>
        </motion.div>
    )
}
