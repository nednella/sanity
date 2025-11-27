import { Button } from "@/lib/ui/components/button"
import { useAuthDialog } from "@/stores/auth-dialog.store"

export function LoginButton() {
    const { onOpen: openAuthDialog } = useAuthDialog()

    return (
        <Button
            className="min-w-24 rounded-full"
            onClick={() => openAuthDialog()}
        >
            Login
        </Button>
    )
}
