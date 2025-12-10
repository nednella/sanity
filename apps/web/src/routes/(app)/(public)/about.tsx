import { createFileRoute } from "@tanstack/react-router"

import { NavbarSpacer } from "@/components/navigation/navbar-spacer"
import { Section } from "@/lib/ui/components/section"

export const Route = createFileRoute("/(app)/(public)/about")({
    component: AboutPage
})

function AboutPage() {
    return (
        <>
            <NavbarSpacer />
            <Section>
                <div>About page.</div>
            </Section>
        </>
    )
}
