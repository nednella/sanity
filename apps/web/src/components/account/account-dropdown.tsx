import { useClerk } from "@clerk/clerk-react"
import { IdCard, LogOut } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/lib/ui/components/dropdown-menu"

interface Props {
    children: React.ReactNode
}

export function AccountDropdown({ children }: Readonly<Props>) {
    const { signOut, openUserProfile } = useClerk()

    const handleAccount = () => openUserProfile()
    const handleLogout = () => signOut()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={8}
            >
                <DropdownMenuItem
                    onSelect={handleAccount}
                    className="cursor-pointer"
                >
                    <IdCard />
                    <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="mx-px" />
                <DropdownMenuItem
                    onClick={handleLogout}
                    variant="destructive"
                    className="cursor-pointer"
                >
                    <LogOut />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
