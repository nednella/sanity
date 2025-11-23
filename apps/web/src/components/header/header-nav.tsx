import { Link } from "@tanstack/react-router"
import { Menu } from "lucide-react"

import { options } from "./header-nav.config"

export function HeaderNavigation() {
    return (
        <>
            <Menu
                className="md:hidden"
                onClick={() => {}}
            />
            <nav className="hidden md:flex md:gap-8">
                {options.map((link) => (
                    <Link
                        key={link.label}
                        to={link.to}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
        </>
    )
}
