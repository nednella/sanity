import { createFileRoute } from "@tanstack/react-router"

import { BackgroundGradient } from "@/components/landing/background-gradient"
import { CallToAction } from "@/components/landing/call-to-action"
import { Hero } from "@/components/landing/hero"
import { Highlights } from "@/components/landing/highlights"
import { Stats } from "@/components/landing/stats"

export const Route = createFileRoute("/(app)/(public)/")({
    component: IndexPage
})

function IndexPage() {
    return (
        <>
            <Hero />
            <BackgroundGradient>
                <Stats />
                <Highlights />
                <CallToAction />
            </BackgroundGradient>
        </>
    )
}
