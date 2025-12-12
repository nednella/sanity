import { createFileRoute } from "@tanstack/react-router"

import { Hero } from "@/components/layout/hero"
import { NavbarSpacer } from "@/components/navigation/navbar-spacer"
import { Section } from "@/lib/ui/components/section"

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
                className="mt-36 mb-24"
            />
            <Section>
                <div>Achievement diary page.</div>
            </Section>
        </>
    )
}
