import type { useAuth } from "@clerk/clerk-react"
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"

import { NotFound } from "@/components/page/not-found"
import { DialogProvider } from "@/providers/dialog-provider"

interface RouterContext {
    auth: ReturnType<typeof useAuth>
}

export const Route = createRootRouteWithContext<RouterContext>()({
    validateSearch: (search: { auth?: string }) => search,
    component: () => (
        <>
            <Outlet />
            <DialogProvider />
            <TanStackRouterDevtools position="bottom-right" />
        </>
    ),
    notFoundComponent: NotFound
})
