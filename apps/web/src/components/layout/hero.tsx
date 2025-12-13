import { motion } from "motion/react"

import { Section } from "@/components/layout/section"
import { H1 } from "@/lib/ui/components/typography/h1"
import { Lead } from "@/lib/ui/components/typography/lead"
import { cn } from "@/lib/ui/utils"

import { Container } from "./container"

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
    visible: { opacity: 1, transition: { duration: 1 } }
}

const MContainer = motion.create(Container)
const MH1 = motion.create(H1)
const MLead = motion.create(Lead)

type HeroProps = {
    title: string
    description: string
    className?: string
    reduceMotion?: boolean
    children?: React.ReactNode
}

export function Hero({ title, description, className, reduceMotion = false, children }: Readonly<HeroProps>) {
    return (
        <Section className={className}>
            <MContainer
                variants={reduceMotion ? undefined : containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center lg:max-w-5xl"
            >
                <MH1
                    variants={reduceMotion ? undefined : itemVariants}
                    className="mb-4"
                >
                    {title}
                </MH1>
                <MLead
                    variants={reduceMotion ? undefined : itemVariants}
                    className={cn(children && "mb-12")}
                >
                    {description}
                </MLead>
                <motion.div
                    variants={reduceMotion ? undefined : itemVariants}
                    className="flex flex-col items-center justify-center gap-4 sm:flex-row"
                >
                    {children}
                </motion.div>
            </MContainer>
        </Section>
    )
}
