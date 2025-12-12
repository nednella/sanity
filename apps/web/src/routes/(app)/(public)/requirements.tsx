import { createFileRoute } from "@tanstack/react-router"

import { Hero } from "@/components/layout/hero"
import { NavbarSpacer } from "@/components/navigation/navbar-spacer"
import { Section } from "@/lib/ui/components/section"

export const Route = createFileRoute("/(app)/(public)/requirements")({
    component: RequirementsPage
})

function RequirementsPage() {
    return (
        <>
            <NavbarSpacer />
            <Hero
                title="Clan Requirements"
                description="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Temporibus labore, illum ex, reprehenderit pariatur doloremque, sint mollitia qui officia quas expedita debitis sapiente! Facilis perferendis laborum non repellat nihil eveniet."
                className="mt-36 mb-24"
            />
            <Section>
                <div>Requirements page.</div>
            </Section>
        </>
    )
}
