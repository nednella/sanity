import { useUser } from "@clerk/clerk-react"
import { createFileRoute } from "@tanstack/react-router"

import { BackgroundGradient } from "@/components/landing/index/background-gradient"
import { Cta } from "@/components/landing/index/cta"
import { Hero } from "@/components/landing/index/hero"
import { Highlights } from "@/components/landing/index/highlights"
import { Stats } from "@/components/landing/index/stats"

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
