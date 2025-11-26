import { Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"
import { motion } from "motion/react"

import { Button } from "@/lib/ui/components/button"
import { H1 } from "@/lib/ui/components/typography/h1"
import { Lead } from "@/lib/ui/components/typography/lead"

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
                    <H1 className="mb-6">Welcome to Sanity</H1>
                    <Lead className="mb-6 text-lg">[tagline]</Lead>
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
                                Join our Discord
                                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                            </a>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="w-64 rounded-full px-8 sm:w-fit"
                        >
                            <Link to="/about">Learn More</Link>
                        </Button>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
