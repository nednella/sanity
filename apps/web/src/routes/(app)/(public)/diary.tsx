import { createFileRoute } from "@tanstack/react-router"

import { Hero } from "@/components/landing/hero"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { NavbarSpacer } from "@/components/navigation/navbar-spacer"

export const Route = createFileRoute("/(app)/(public)/diary")({
    component: AchievementDiaryPage
})

function AchievementDiaryPage() {
    return (
        <>
            <NavbarSpacer />
            <Hero
                title="Achievement Diary"
                description="for those looking to push themselves beyond the in-game achievements"
                className="pt-36 pb-24"
                reduceMotion
            />
            <Section>
                <Container>
                    <span>Achievement diary page.</span>
                </Container>
            </Section>
        </>
    )
}
