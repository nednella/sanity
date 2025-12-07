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
            <SidebarHeader className="h-16 border-b p-4">
                <Link
                    to="/"
                    className="text-foreground hover:text-foreground/80 flex items-center justify-center text-lg
                        font-bold transition-colors"
                >
                    Sanity
                </Link>
            </SidebarHeader>
            <SidebarContent className="px-2 py-6">
                <SidebarGroup>
                    <SidebarGroupLabel className="font-semibold tracking-wider uppercase">About</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {aboutLinks.map((link) => (
                                <SidebarMenuItem key={link.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={link.title}
                                        className="rounded-lg px-4"
                                    >
                                        <Link
                                            to={link.to}
                                            inactiveProps={{ className: "text-muted-foreground" }}
                                        >
                                            <span className="font-medium">{link.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel className="font-semibold tracking-wider uppercase">Members</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {memberLinks.map((link) => (
                                <SidebarMenuItem key={link.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={link.title}
                                        className="rounded-lg px-4"
                                    >
                                        <Link
                                            to={link.to}
                                            inactiveProps={{ className: "text-muted-foreground" }}
                                        >
                                            <span className="font-medium">{link.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4">
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
