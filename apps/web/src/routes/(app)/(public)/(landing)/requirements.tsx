import { createFileRoute } from "@tanstack/react-router"

import { NavbarSpacer } from "@/components/navigation/navbar-spacer"
import { Container } from "@/lib/ui/components/container"

export const Route = createFileRoute("/(app)/(public)/(landing)/requirements")({
    component: RequirementsPage
})

function RequirementsPage() {
    return (
        <>
            <NavbarSpacer />
            <Container>
                <div>Requirements page.</div>
            </Container>
        </>
    )
}
