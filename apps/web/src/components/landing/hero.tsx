import { Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"
import { motion } from "motion/react"

import { Button } from "@/lib/ui/components/button"

const headingPrimary = "Welcome to Sanity"
const headingSecondary = "<tagline>"

const buttonDiscord = "Join our Discord"
const buttonMore = "Learn More"

export function Hero() {
    return (
        <section className="bg-background flex min-h-screen items-center justify-center">
            <motion.div
                className="container mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.1 }}
            >
                <div className="text-center">
                    <h1 className="mb-6 text-4xl leading-tight font-bold text-balance">{headingPrimary}</h1>
                    <p className="text-muted-foreground mb-6 text-lg leading-relaxed">{headingSecondary}</p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button
                            asChild
                            size="lg"
                            className="group w-64 rounded-full px-8! sm:w-fit"
                        >
                            <a
                                href="https://discord.gg/sanity"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span>{buttonDiscord}</span>
                                <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                            </a>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="w-64 rounded-full px-8 sm:w-fit"
                        >
                            <Link to="/about">{buttonMore}</Link>
                        </Button>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
