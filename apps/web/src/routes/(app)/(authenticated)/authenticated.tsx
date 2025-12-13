import { createFileRoute } from "@tanstack/react-router"

import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { NavbarSpacer } from "@/components/navigation/navbar-spacer"

export const Route = createFileRoute("/(app)/(authenticated)/authenticated")({
    component: AuthenticatedPage
})

function AuthenticatedPage() {
    return (
        <>
            <NavbarSpacer />
            <Section>
                <Container>
                    <span>Authenticated page.</span>
                </Container>
            </Section>
        </>
    )
}
