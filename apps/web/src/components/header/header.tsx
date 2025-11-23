import { HeaderAuth } from "./header-auth"
import { HeaderLogo } from "./header-logo"
import { HeaderNavigation } from "./header-nav"

export function Header() {
    return (
        <header className="fixed z-50 w-full md:top-4 md:right-8 md:left-8 md:w-auto">
            <div
                className="bg-background/90 mx-auto flex h-16 max-w-7xl items-center justify-between px-6 py-2
                    md:rounded-md md:px-2"
            >
                <HeaderLogo />
                <HeaderNavigation />
                <HeaderAuth />
            </div>
        </header>
    )
}
