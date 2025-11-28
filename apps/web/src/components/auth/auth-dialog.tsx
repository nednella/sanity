import { SignIn } from "@clerk/clerk-react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

import { Dialog, DialogTitle, UnstyledDialogContent } from "@/lib/ui/components/dialog"
import { useAuthDialog } from "@/stores/auth-dialog.store"

export function LoginDialog() {
    const { isOpen, onClose } = useAuthDialog()

    const onOpenChange = (open: boolean) => {
        if (!open) {
            onClose()
        }
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onOpenChange}
        >
            <UnstyledDialogContent aria-describedby={undefined}>
                <VisuallyHidden>
                    <DialogTitle>Login</DialogTitle>
                </VisuallyHidden>

                <SignIn />
            </UnstyledDialogContent>
        </Dialog>
    )
}
