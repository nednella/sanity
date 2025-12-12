import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"

import { isAuthenticated } from "@/utils/auth"

export const Route = createFileRoute("/(app)/(authenticated)")({
    beforeLoad({ context: { auth } }) {
        if (!isAuthenticated(auth)) {
            throw redirect({
                to: "/",
                search: { auth: "login" },
                replace: true
            })
        }
    },
    component: () => <Outlet />
})
