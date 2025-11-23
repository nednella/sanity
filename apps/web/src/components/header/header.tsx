import { SignedIn, SignedOut } from "@clerk/clerk-react"
import { Link } from "@tanstack/react-router"
import { Menu } from "lucide-react"

import { AccountButton } from "../auth/account-button"
import { LoginButton } from "../auth/login-button"
import { options } from "./header-navigation.config"

export function Header() {
    return (
        <header className="fixed z-50 w-full md:top-4 md:right-8 md:left-8 md:w-auto">
            <div
                className="mx-auto flex h-16 max-w-7xl items-center justify-between bg-green-500/90 px-6 py-2
                    md:rounded-md md:px-2"
            >
                {/* mobile menu */}
                <Menu
                    className="md:hidden"
                    onClick={() => {}}
                />
                {/* logo */}
                <Link
                    to="/"
                    className="hidden md:block md:w-32"
                >
                    Sanity
                </Link>
                {/* nav */}
                <nav className="hidden md:flex md:flex-1 md:justify-center md:gap-8">
                    {options.map((link) => (
                        <Link
                            key={link.label}
                            to={link.to}
                        >
                            {link.label}
                        </Link>
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
