import { useUser } from "@clerk/clerk-react"
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { UserRound } from "lucide-react"

import { Avatar } from "@/lib/ui/components/avatar"
import { Button } from "@/lib/ui/components/button"

import { AccountDropdown } from "./account-dropdown"

export function AccountButton() {
    const { user } = useUser()

    const imageUrl = user?.imageUrl ?? undefined
    const username = user?.username ?? undefined

    return (
        <AccountDropdown>
            <Button
                size="avatar"
                variant="ghost"
                className="data-[state=open]:bg-accent cursor-pointer"
            >
                <Avatar className="size-8">
                    <AvatarImage
                        src={imageUrl}
                        alt={username}
                    />
                    <AvatarFallback>
                        <UserRound size={16} />
                    </AvatarFallback>
                </Avatar>
            </Button>
        </AccountDropdown>
    )
}
