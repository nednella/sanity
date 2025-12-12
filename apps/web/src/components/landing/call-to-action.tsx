import { ArrowRight } from "lucide-react"
import { motion } from "motion/react"

import { DiscordLogo } from "@/components/logos/discord-logo"
import { TwitterLogo } from "@/components/logos/twitter-logo"
import { Button } from "@/lib/ui/components/button"
import { Section } from "@/lib/ui/components/section"
import { H3 } from "@/lib/ui/components/typography/h3"
import { Muted } from "@/lib/ui/components/typography/muted"

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } }
}

const MH3 = motion.create(H3)
const MMuted = motion.create(Muted)

export function CallToAction() {
    return (
        <Section className="max-w-4xl pb-48 text-center">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-background hover:border-foreground/20 rounded-3xl border p-12 transition-all duration-300
                    hover:shadow-lg"
            >
                <MH3
                    variants={itemVariants}
                    className="mb-2"
                >
                    Get Involved
                </MH3>
                <MMuted
                    variants={itemVariants}
                    className="mb-8 text-lg"
                >
                    join our community, connect with members and learn more.
                </MMuted>
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col justify-center gap-4 sm:flex-row"
                >
                    <Button
                        asChild
                        size="lg"
                        variant="custom"
                        className="group rounded-full bg-[#5865F2] px-8! text-white hover:opacity-90"
                    >
                        <a
                            href="https://discord.gg/sanity"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <DiscordLogo className="mr-2 size-4 fill-white" />
                            <span>Join our Discord</span>
                            <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                        </a>
                    </Button>
                    <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="group rounded-full px-8! transition-none"
                    >
                        <a
                            href="https://twitter.com/sanityosrs"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <TwitterLogo className="fill-foreground mr-2 size-4" />
                            <span>Follow us on X</span>
                            <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                        </a>
                    </Button>
                </motion.div>
            </motion.div>
        </Section>
    )
}
