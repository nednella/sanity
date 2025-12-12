import { useLocation, useNavigate } from "@tanstack/react-router"

import { Button } from "@/lib/ui/components/button"

export function LoginButton() {
    const navigate = useNavigate()
    const location = useLocation()

    const currentLocation = location.pathname

    return (
        <Button
            className="min-w-24 rounded-full"
            onClick={() => navigate({ to: currentLocation, search: { auth: "login" } })}
        >
            Login
        </Button>
    )
}
