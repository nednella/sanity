import { Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"
import { motion } from "motion/react"

import { DiscordLogo } from "@/components/logos/discord-logo"
import { Button } from "@/lib/ui/components/button"
import { H1 } from "@/lib/ui/components/typography/h1"
import { Muted } from "@/lib/ui/components/typography/muted"

import { ScrollIndicator } from "./scroll-indicator"

export function Hero() {
    return (
        <section className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden">
            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    >
                        <H1 className="mb-6 text-5xl sm:text-6xl md:text-7xl">Welcome to Sanity</H1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    >
                        <Muted className="mx-auto mb-12 max-w-xl text-base sm:text-lg">
                            an elite Old School RuneScape PvM clan home to some of the best players in the game.
                        </Muted>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        className="flex flex-col items-center justify-center gap-4 sm:flex-row"
                    >
                        <Button
                            asChild
                            size="lg"
                            className="group w-full max-w-xs rounded-full px-8 shadow-lg transition-all hover:shadow-xl
                                sm:w-auto"
                        >
                            <a
                                href="https://discord.gg/sanity"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <DiscordLogo className="fill-primary-foreground mr-2 size-4" />
                                <span>Join our Discord</span>
                                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                            </a>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="hover:bg-accent w-full max-w-xs rounded-full px-8 transition-all sm:w-auto"
                        >
                            <Link to="/about">Learn More</Link>
                        </Button>
                    </motion.div>
                </motion.div>

                <ScrollIndicator />
            </div>
        </section>
    )
}
