import type { useAuth } from "@clerk/clerk-react"

export function isAuthenticated(auth: ReturnType<typeof useAuth>) {
    return auth.isSignedIn
}
