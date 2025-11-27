import { createFileRoute } from "@tanstack/react-router"

import { NavbarSpacer } from "@/components/header/navbar-spacer"
import { Container } from "@/lib/ui/components/container"

export const Route = createFileRoute("/_app/(public)/about")({
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
