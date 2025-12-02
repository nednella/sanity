import { Link } from "@tanstack/react-router"

import { DesktopButtons } from "./navbar-desktop-buttons"
import { DesktopNavigation } from "./navbar-desktop-navigation"
import { MobileButtons } from "./navbar-mobile-buttons"

/**
 * TODO
 *
 * 2. Add mobile/tablet sidebar navigation with nested links to replace hover links
 * 3. Remove this comment block
 * 4. merge feature as mobile navigation
 */

export function Navbar() {
    return (
        <header className="fixed inset-x-0 z-50">
            <div className="mx-auto max-w-7xl lg:px-4 lg:pt-4">
                <div
                    className="bg-background flex h-16 items-center justify-between px-6 shadow-md lg:grid
                        lg:grid-cols-[1fr_auto_1fr] lg:rounded-2xl lg:border"
                >
                    <Link
                        to="/"
                        className="font-bold"
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
