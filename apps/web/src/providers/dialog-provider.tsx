import { AuthDialog } from "@/components/auth/auth-dialog"

/**
 * This provider should be mounted within the RouterProvider,
 * as some dialogs use search params for persistence, e.g. {@link AuthDialog}.
 */
export function DialogProvider() {
    return (
        <>
            <AuthDialog />
        </>
    )
}
