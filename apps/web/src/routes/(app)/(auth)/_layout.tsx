import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"

import { isAuthenticated } from "@/utils/auth"

export const Route = createFileRoute("/(app)/(auth)")({
    beforeLoad({ context: { auth } }) {
        if (!isAuthenticated(auth)) {
            throw redirect({
                to: "/",
                replace: true
            })
        }
    },
    component: () => <Outlet />
})
