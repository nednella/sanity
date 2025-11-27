import { SignIn } from "@clerk/clerk-react"

import { Dialog, UnstyledDialogContent } from "@/lib/ui/components/dialog"
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
            <UnstyledDialogContent>
                <SignIn />
            </UnstyledDialogContent>
        </Dialog>
    )
}
