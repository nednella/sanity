import { Menu } from "lucide-react"

import { useSidebar } from "@/lib/ui/components/sidebar"

import { ThemeToggle } from "../theme/theme-toggle"

export function MobileButtons() {
    const { toggleSidebar } = useSidebar()

    return (
        <div className="flex items-center gap-4 lg:hidden">
            <ThemeToggle />
            <Menu onClick={toggleSidebar} />
        </div>
    )
}
