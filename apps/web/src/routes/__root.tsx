import type { useAuth } from "@clerk/clerk-react"
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"

import { NotFound } from "@/components/page/not-found"

interface RouterContext {
    auth: ReturnType<typeof useAuth>
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: () => (
        <>
            <Outlet />
            <TanStackRouterDevtools position="bottom-right" />
        </>
    ),
    notFoundComponent: NotFound
})
