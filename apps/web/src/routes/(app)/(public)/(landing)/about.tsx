import { createFileRoute } from "@tanstack/react-router"

import { NavbarSpacer } from "@/components/navigation/navbar-spacer"
import { Container } from "@/lib/ui/components/container"

export const Route = createFileRoute("/(app)/(public)/(landing)/about")({
    component: AboutPage
})

function AboutPage() {
    return (
        <>
            <NavbarSpacer />
            <Container>
                <div>About page.</div>
            </Container>
        </>
    )
}
