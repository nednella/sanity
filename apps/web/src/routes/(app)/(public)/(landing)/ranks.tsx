import { createFileRoute } from "@tanstack/react-router"

import { NavbarSpacer } from "@/components/navigation/navbar-spacer"
import { Container } from "@/lib/ui/components/container"

export const Route = createFileRoute("/(app)/(public)/(landing)/ranks")({
    component: RanksPage
})

function RanksPage() {
    return (
        <>
            <NavbarSpacer />
            <Container>
                <div>Ranks page.</div>
            </Container>
        </>
    )
}
