import { motion } from "motion/react"

import { Section } from "@/lib/ui/components/section"
import { H1 } from "@/lib/ui/components/typography/h1"
import { Lead } from "@/lib/ui/components/typography/lead"
import { cn } from "@/lib/ui/utils"

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
const MSection = motion.create(Section)
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
        <MSection
            className={cn("relative text-center", className)}
            variants={reduceMotion ? undefined : containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
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
                className="flex flex-col items-center justify-center gap-4 sm:flex-row"
                variants={reduceMotion ? undefined : itemVariants}
            >
                {children}
            </motion.div>
        </MSection>
    )
}
