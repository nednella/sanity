import { Link } from "@tanstack/react-router"

import { DesktopButtons } from "./navbar-desktop-buttons"
import { DesktopNavigation } from "./navbar-desktop-navigation"
import { MobileButtons } from "./navbar-mobile-buttons"

export function Navbar() {
    return (
        <header className="fixed inset-x-0 top-0 z-50">
            <div className="mx-auto max-w-7xl lg:px-4 lg:pt-4">
                <div
                    className="bg-background flex h-16 items-center justify-between border-b px-6 shadow-sm
                        transition-all lg:grid lg:grid-cols-[1fr_auto_1fr] lg:rounded-2xl lg:border lg:border-b
                        lg:shadow-md"
                >
                    <Link
                        to="/"
                        className="text-foreground hover:text-foreground/80 w-fit text-lg font-bold transition-colors"
                    >
                        Sanity
                    </Link>
                    <DesktopNavigation />
                    <DesktopButtons />
                    <MobileButtons />
                </div>
            </div>
        </header>
    )
}
