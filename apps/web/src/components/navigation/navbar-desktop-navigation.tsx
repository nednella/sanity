import { Link } from "@tanstack/react-router"

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from "@/lib/ui/components/navigation-menu"
import { Small } from "@/lib/ui/components/typography/small"
import { useIsMobile } from "@/lib/ui/hooks/use-mobile"

import { aboutLinks, memberLinks } from "./navigation.config"

export function DesktopNavigation() {
    const isMobile = useIsMobile()

    return (
        <NavigationMenu
            viewport={isMobile}
            className="hidden lg:flex"
        >
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Info</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="flex w-fit min-w-70 flex-col gap-1 p-2">
                            {aboutLinks.map((link) => (
                                <ListItem
                                    key={link.title}
                                    to={link.to}
                                    title={link.title}
                                    description={link.description}
                                />
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuTrigger>Members</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="flex w-fit min-w-70 flex-col gap-1 p-2">
                            {memberLinks.map((link) => (
                                <ListItem
                                    key={link.title}
                                    to={link.to}
                                    title={link.title}
                                    description={link.description}
                                />
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link to="/authenticated">Authenticated</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

function ListItem({
    title,
    description,
    to,
    ...props
}: React.ComponentPropsWithoutRef<"li"> & { to: string; description: string }) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link to={to}>
                    <Small>{title}</Small>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">{description}</p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
}
