import { Outlet, createFileRoute } from "@tanstack/react-router"

import { Header } from "@/components/header/header"
import { HeaderSpacer } from "@/components/header/header-spacer"

export const Route = createFileRoute("/(public)")({
    component: PublicLayout
})

function PublicLayout() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <HeaderSpacer />
            <Outlet />
        </div>
    )
}
