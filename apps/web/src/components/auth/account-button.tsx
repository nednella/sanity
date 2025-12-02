import { useUser } from "@clerk/clerk-react"
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { ChevronsUpDown, UserRound } from "lucide-react"

import { Avatar } from "@/lib/ui/components/avatar"
import { Button } from "@/lib/ui/components/button"
import { SidebarMenuButton } from "@/lib/ui/components/sidebar"

import { AccountDropdown } from "./account-dropdown"

type Props = {
    variant: "avatar" | "sidebar"
}

export function AccountButton({ variant }: Readonly<Props>) {
    const { user } = useUser()

    const imageUrl = user?.imageUrl ?? undefined
    const username = user?.username ?? undefined
    const emailAddress = user?.primaryEmailAddress?.emailAddress ?? undefined

    if (variant === "sidebar") {
        return (
            <AccountDropdown>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground
                        cursor-pointer"
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
                    <div className="grid flex-1 text-left text-sm leading-tight tracking-tight">
                        <span className="truncate font-medium">{username}</span>
                        <span className="text-muted-foreground truncate text-xs">{emailAddress}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
            </AccountDropdown>
        )
    }

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
