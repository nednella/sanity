import { createFileRoute } from "@tanstack/react-router"

import { NavbarSpacer } from "@/components/navigation/navbar-spacer"
import { Container } from "@/lib/ui/components/container"

export const Route = createFileRoute("/(app)/(authenticated)/authenticated")({
    component: AuthenticatedPage
})

function AuthenticatedPage() {
    return (
        <>
            <NavbarSpacer />
            <Container>
                <div>Authenticated page.</div>
            </Container>
        </>
    )
}
