import { SignedIn, SignedOut } from "@clerk/clerk-react"
import { Link } from "@tanstack/react-router"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/lib/ui/components/sidebar"
import { useIsMobile } from "@/lib/ui/hooks/use-mobile"

import { AccountButton } from "../auth/account-button"
import { LoginButton } from "../auth/login-button"
import { aboutLinks, memberLinks } from "./navigation.config"

export function MobileSidebar() {
    const isMobile = useIsMobile()

    // eslint-disable-next-line unicorn/no-null
    if (!isMobile) return null

    return (
        <Sidebar>
            <SidebarHeader className="p-4 text-center">
                <span className="font-bold">Sanity</span>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="font-bold">About</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {aboutLinks.map((link) => (
                                <SidebarMenuItem key={link.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={link.title}
                                    >
                                        <Link
                                            to={link.to}
                                            inactiveProps={{ className: "text-muted-foreground" }}
                                        >
                                            <span>{link.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel className="font-bold">Members</SidebarGroupLabel>
                    <SidebarGroupContent>
                        {memberLinks.map((link) => (
                            <SidebarMenuItem key={link.title}>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={link.title}
                                >
                                    <Link
                                        to={link.to}
                                        inactiveProps={{ className: "text-muted-foreground" }}
                                    >
                                        <span>{link.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SignedOut>
                    <LoginButton />
                </SignedOut>
                <SignedIn>
                    <AccountButton variant="sidebar" />
                </SignedIn>
            </SidebarFooter>
        </Sidebar>
    )
}
