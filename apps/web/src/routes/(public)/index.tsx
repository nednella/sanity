import { useUser } from "@clerk/clerk-react"
import { createFileRoute } from "@tanstack/react-router"

import { BackgroundGradient } from "@/components/landing/background-gradient"
import { Cta } from "@/components/landing/cta"
import { Hero } from "@/components/landing/hero"
import { Highlights } from "@/components/landing/highlights"
import { Stats } from "@/components/landing/stats"

export const Route = createFileRoute("/(public)/")({
    component: IndexPage
})

function IndexPage() {
    const user = useUser()
    console.log(user)

    return (
        <>
            <BackgroundGradient />
            <Hero />
            <Stats />
            <Highlights />
            <Cta />
        </>
    )
}
