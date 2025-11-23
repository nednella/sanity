import React from "react"

import { SignIn } from "@clerk/clerk-react"

import { Dialog, DialogTrigger, UnstyledDialogContent } from "@/lib/ui/components/dialog"

interface Props {
    children: React.ReactNode
}

export function LoginDialog({ children }: Readonly<Props>) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <UnstyledDialogContent>
                <SignIn />
            </UnstyledDialogContent>
        </Dialog>
    )
}
