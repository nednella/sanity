import { useEffect } from "react"

import { SignIn, useUser } from "@clerk/clerk-react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useLocation, useNavigate, useSearch } from "@tanstack/react-router"

import { Dialog, DialogTitle, UnstyledDialogContent } from "@/lib/ui/components/dialog"

export function AuthDialog() {
    const { isLoaded, isSignedIn } = useUser()
    const navigate = useNavigate()
    const location = useLocation()
    const { auth } = useSearch({ from: "__root__" })

    const isOpen = auth === "login"
    const currentLocation = location.pathname

    useEffect(() => {
        if (isOpen && isSignedIn) {
            navigate({ to: currentLocation, search: { auth: undefined } }) // clean the URL when authenticated
        }
    }, [isOpen, isSignedIn, currentLocation, navigate])

    // eslint-disable-next-line unicorn/no-null
    if (!isLoaded || (isOpen && isSignedIn)) return null // prevent mounting before context load or when already authenticated

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    navigate({ to: currentLocation, search: { auth: undefined } })
                }
            }}
        >
            <UnstyledDialogContent aria-describedby={undefined}>
                <VisuallyHidden>
                    <DialogTitle>Login</DialogTitle>
                </VisuallyHidden>
                <SignIn
                    forceRedirectUrl={currentLocation}
                    signUpForceRedirectUrl={currentLocation}
                    appearance={{ elements: { footerAction: { display: "none" } } }}
                />
            </UnstyledDialogContent>
        </Dialog>
    )
}
