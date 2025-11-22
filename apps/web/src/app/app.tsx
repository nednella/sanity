import { useAuth } from "@clerk/clerk-react"
import { RouterProvider } from "@tanstack/react-router"

import { AppProvider } from "./providers"
import { router } from "./router"

export function App() {
    return (
        <AppProvider>
            <EntryPoint />
        </AppProvider>
    )
}

function EntryPoint() {
    const auth = useAuth()

    return (
        <RouterProvider
            router={router}
            context={{ auth }}
        />
    )
}
