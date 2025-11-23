import { SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react"

import { AccountButton } from "../account/account-button"

export function HeaderAuth() {
    return (
        <>
            <SignedOut>
                <SignInButton />
            </SignedOut>
            <SignedIn>
                <AccountButton />
            </SignedIn>
        </>
    )
}
