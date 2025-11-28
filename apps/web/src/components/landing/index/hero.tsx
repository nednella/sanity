import { Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"
import { motion } from "motion/react"

import { DiscordLogo } from "@/components/logos/discord-logo"
import { Button } from "@/lib/ui/components/button"
import { H1 } from "@/lib/ui/components/typography/h1"
import { Lead } from "@/lib/ui/components/typography/lead"

import { ScrollIndicator } from "./scroll-indicator"

export function Hero() {
    return (
        <section className="bg-background flex min-h-screen items-center justify-center">
            <motion.div
                className="container mx-auto text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.1 }}
            >
                <H1 className="mb-4">Welcome to Sanity</H1>
                <Lead className="mb-8 px-4 text-lg">
                    an elite Old School RuneScape PvM clan home to some of the best players in the game.
                </Lead>
                <div className="flex flex-col justify-center gap-4 px-4 sm:flex-row sm:items-center">
                    <Button
                        asChild
                        size="lg"
                        className="group mx-auto w-full max-w-80 rounded-full px-8! transition-all sm:mx-0 sm:w-fit"
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
                        className="mx-auto w-full max-w-80 rounded-full px-8 sm:mx-0 sm:w-fit"
                    >
                        <Link to="/about">Learn More</Link>
                    </Button>
                </div>
            </motion.div>
            <ScrollIndicator />
        </section>
    )
}
