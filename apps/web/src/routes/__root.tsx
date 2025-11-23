import type { useAuth } from "@clerk/clerk-react"
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"

import { Header } from "@/components/header/header"
import { HeaderSpacer } from "@/components/header/header-spacer"

interface RouterContext {
    auth: ReturnType<typeof useAuth>
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: () => (
        <>
            <div className="min-h-screen w-screen">
                <Header />
                <HeaderSpacer />
                <Outlet />
            </div>
            <TanStackRouterDevtools position="bottom-right" />
        </>
    )
})
