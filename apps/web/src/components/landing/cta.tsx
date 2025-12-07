import { ArrowRight } from "lucide-react"
import { motion } from "motion/react"

import { DiscordLogo } from "@/components/logos/discord-logo"
import { TwitterLogo } from "@/components/logos/twitter-logo"
import { Button } from "@/lib/ui/components/button"
import { Container } from "@/lib/ui/components/container"
import { H3 } from "@/lib/ui/components/typography/h3"
import { Lead } from "@/lib/ui/components/typography/lead"

export function Cta() {
    return (
        <Container className="max-w-4xl pt-24 pb-48 text-center">
            <motion.div
                viewport={{ once: true, margin: "-100px" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div
                    className="bg-background hover:border-foreground/20 rounded-3xl border p-12 transition-all
                        duration-300 hover:shadow-lg sm:p-16"
                >
                    <H3 className="mb-2 text-3xl">Interested in Joining?</H3>
                    <Lead className="mb-8 text-lg">join our community, connect with members and learn more.</Lead>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button
                            asChild
                            size="lg"
                            variant="custom"
                            className="group w-full rounded-full bg-[#5865F2] px-8 text-white shadow-lg
                                hover:bg-[#4752C4] hover:shadow-xl sm:w-auto"
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
                            className="group hover:bg-accent w-full rounded-full px-8 transition-none sm:w-auto"
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
                    </div>
                </div>
            </motion.div>
        </Container>
    )
}
