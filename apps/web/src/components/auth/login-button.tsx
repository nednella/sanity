import { Button } from "@/lib/ui/components/button"

import { LoginDialog } from "./login-dialog"

export function LoginButton() {
    return (
        <LoginDialog>
            <Button className="min-w-24 rounded-full">Login</Button>
        </LoginDialog>
    )
}
