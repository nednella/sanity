import { SignedIn, SignedOut } from "@clerk/clerk-react"
import { Link } from "@tanstack/react-router"
import { Menu } from "lucide-react"

import { Button } from "@/lib/ui/components/button"

import { AccountButton } from "../auth/account-button"
import { LoginButton } from "../auth/login-button"
import { ThemeToggle } from "../theme/theme-toggle"
import { options } from "./navbar.config"

export function Navbar() {
    return (
        <header className="fixed inset-x-0 z-50 md:top-4 md:right-4 md:left-4">
            <div className="mx-auto max-w-7xl px-4">
                <div
                    className="bg-background grid h-16 grid-cols-[1fr_1fr] items-center px-6 shadow-md
                        md:grid-cols-[1fr_auto_1fr] md:rounded-lg md:border"
                >
                    {/* logo */}
                    <div className="hidden md:block">
                        <Link
                            to="/"
                            className="font-bold"
                        >
                            Sanity
                        </Link>
                    </div>

                    {/* mobile menu toggle */}
                    <Menu
                        className="md:hidden"
                        onClick={() => {}}
                    />

                    {/* nav links */}
                    <nav className="hidden md:flex md:gap-8">
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
