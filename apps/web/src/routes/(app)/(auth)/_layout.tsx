import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"

import { useAuthDialog } from "@/stores/auth-dialog.store"
import { isAuthenticated } from "@/utils/auth"

export const Route = createFileRoute("/(app)/(auth)")({
    beforeLoad({ context: { auth } }) {
        if (!isAuthenticated(auth)) {
            useAuthDialog.getState().onOpen()

            throw redirect({
                to: "/",
                replace: true
            })
        }
    },
    component: () => <Outlet />
})
