import { Menu } from "lucide-react"

import { Button } from "@/lib/ui/components/button"
import { useSidebar } from "@/lib/ui/components/sidebar"

import { ThemeToggle } from "../theme/theme-toggle"

export function MobileButtons() {
    const { toggleSidebar } = useSidebar()

    return (
        <div className="flex items-center gap-4 lg:hidden">
            <ThemeToggle />
            <Button
                size="icon"
                variant="ghost"
                className="rounded-lg"
                aria-label="Open Menu"
                onClick={toggleSidebar}
            >
                <Menu className="size-5" />
            </Button>
        </div>
    )
}
