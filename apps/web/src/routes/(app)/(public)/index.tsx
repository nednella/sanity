import { Link, createFileRoute } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"

import { BackgroundGradient } from "@/components/landing/background-gradient"
import { CallToAction } from "@/components/landing/call-to-action"
import { Highlights } from "@/components/landing/highlights"
import { ScrollIndicator } from "@/components/landing/scroll-indicator"
import { Stats } from "@/components/landing/stats"
import { Hero } from "@/components/layout/hero"
import { DiscordLogo } from "@/components/logos/discord-logo"
import { Button } from "@/lib/ui/components/button"

export const Route = createFileRoute("/(app)/(public)/")({
    component: IndexPage
})

function IndexPage() {
    return (
        <>
            <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
                <Hero
                    title="Welcome to Sanity"
                    description="an elite Old School RuneScape PvM clan home to some of the best players in the game."
                >
                    <Button
                        asChild
                        size="lg"
                        className="group w-full max-w-xs rounded-full px-8! shadow-lg transition-all hover:shadow-xl
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
                </Hero>
                <ScrollIndicator />
            </div>
            <BackgroundGradient>
                <Stats />
                <Highlights />
                <CallToAction />
            </BackgroundGradient>
        </>
    )
}
