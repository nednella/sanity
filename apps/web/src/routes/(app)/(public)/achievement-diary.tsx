import { createFileRoute } from "@tanstack/react-router"

import { Container } from "@/components/layout/container"
import { Hero } from "@/components/layout/hero"
import { Section } from "@/components/layout/section"
import { NavbarSpacer } from "@/components/navigation/navbar-spacer"

export const Route = createFileRoute("/(app)/(public)/achievement-diary")({
    component: AchievementDiaryPage
})

function AchievementDiaryPage() {
    return (
        <>
            <NavbarSpacer />
            <Hero
                title="Achievement Diary"
                description="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Temporibus labore, illum ex, reprehenderit pariatur doloremque, sint mollitia qui officia quas expedita debitis sapiente! Facilis perferendis laborum non repellat nihil eveniet."
                className="pt-36 pb-24"
            />
            <Section>
                <Container>
                    <span>Achievement diary page.</span>
                </Container>
            </Section>
        </>
    )
}
