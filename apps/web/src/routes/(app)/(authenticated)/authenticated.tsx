import { createFileRoute } from "@tanstack/react-router"

import { NavbarSpacer } from "@/components/navigation/navbar-spacer"
import { Section } from "@/lib/ui/components/section"

export const Route = createFileRoute("/(app)/(authenticated)/authenticated")({
    component: AuthenticatedPage
})

function AuthenticatedPage() {
    return (
        <>
            <NavbarSpacer />
            <Section>
                <div>Authenticated page.</div>
            </Section>
        </>
    )
}
