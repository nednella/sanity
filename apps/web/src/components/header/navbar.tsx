import { SignedIn, SignedOut } from "@clerk/clerk-react"
import { Link } from "@tanstack/react-router"
import { Menu } from "lucide-react"

import { Button } from "@/lib/ui/components/button"

import { AccountButton } from "../auth/account-button"
import { LoginButton } from "../auth/login-button"
import { options } from "./navbar.config"

export function Navbar() {
    return (
        <header className="bg-background/80 fixed z-50 w-full backdrop-blur-sm">
            <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 py-2 md:rounded-md">
                {/* mobile menu */}
                <Menu
                    className="md:hidden"
                    onClick={() => {}}
                />
                {/* logo */}
                <div className="hidden md:block md:w-32">
                    <Link to="/">Sanity</Link>
                </div>
                {/* nav */}
                <nav className="hidden md:flex md:flex-1 md:justify-center md:gap-8">
                    {options.map((link) => (
                        <Button
                            key={link.label}
                            asChild
                            variant="ghost"
                        >
                            <Link
                                to={link.to}
                                activeProps={{ className: "text-foreground" }}
                                inactiveProps={{ className: "text-muted-foreground" }}
                            >
                                {link.label}
                            </Link>
                        </Button>
                    ))}
                </nav>
                {/* auth */}
                <div className="flex md:w-32 md:justify-end">
                    <SignedOut>
                        <LoginButton />
                    </SignedOut>
                    <SignedIn>
                        <AccountButton />
                    </SignedIn>
                </div>
            </div>
        </header>
    )
}
