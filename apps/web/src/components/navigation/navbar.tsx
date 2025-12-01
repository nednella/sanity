import { SignedIn, SignedOut } from "@clerk/clerk-react"
import { Link } from "@tanstack/react-router"
import { Menu } from "lucide-react"

import { Button } from "@/lib/ui/components/button"

import { AccountButton } from "../auth/account-button"
import { LoginButton } from "../auth/login-button"
import { ThemeToggle } from "../theme/theme-toggle"
import { options } from "./navbar.config"

/**
 * TODO
 *
 * 1. Add desktop hover links
 * 2. Add mobile/tablet sidebar navigation with nested links to replace hover links
 */

export function Navbar() {
    return (
        <header className="fixed inset-x-0 z-50">
            <div className="mx-auto max-w-7xl lg:px-4 lg:pt-4">
                <div
                    className="bg-background flex h-16 items-center justify-between px-6 shadow-md lg:grid
                        lg:grid-cols-[1fr_auto_1fr] lg:rounded-2xl lg:border"
                >
                    {/* mobile menu toggle */}
                    <Menu
                        className="md:hidden"
                        onClick={() => {}}
                    />

                    {/* logo */}
                    <Link
                        to="/"
                        className="font-bold"
                    >
                        Sanity
                    </Link>

                    {/* nav links */}
                    <nav className="hidden lg:flex lg:gap-8">
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

                    {/* buttons */}
                    <div className="flex items-center justify-end gap-4">
                        <ThemeToggle />
                        <SignedOut>
                            <LoginButton />
                        </SignedOut>
                        <SignedIn>
                            <AccountButton />
                        </SignedIn>
                    </div>
                </div>
            </div>
        </header>
    )
}
