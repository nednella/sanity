import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut } from "@clerk/clerk-react"

import { AccountButton } from "../auth/account-button"
import { LoginButton } from "../auth/login-button"
import { ThemeToggle } from "../theme/theme-toggle"

export function DesktopButtons() {
    return (
        <div className="hidden items-center justify-end gap-2 lg:flex">
            <ThemeToggle />
            <ClerkLoading>
                <LoginButton />
            </ClerkLoading>
            <ClerkLoaded>
                <SignedOut>
                    <LoginButton />
                </SignedOut>
                <SignedIn>
                    <AccountButton variant="avatar" />
                </SignedIn>
            </ClerkLoaded>
        </div>
    )
}
