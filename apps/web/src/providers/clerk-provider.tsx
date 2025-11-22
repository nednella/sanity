import React from "react"

import { ClerkProvider } from "@clerk/clerk-react"
import { shadcn } from "@clerk/themes"

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!CLERK_PUBLISHABLE_KEY) {
    throw new Error("Clerk Publishable Key missing from .env file!")
}

interface Props {
    children: React.ReactNode
}

export function SanityClerkProvider({ children }: Readonly<Props>) {
    return (
        <ClerkProvider
            publishableKey={CLERK_PUBLISHABLE_KEY}
            appearance={{
                theme: shadcn
            }}
        >
            {children}
        </ClerkProvider>
    )
}
