import { Sidebar } from "@/lib/ui/components/sidebar"
import { useIsMobile } from "@/lib/ui/hooks/use-mobile"

export function MobileSidebar() {
    const isMobile = useIsMobile()

    // eslint-disable-next-line unicorn/no-null
    if (!isMobile) return null

    return (
        <Sidebar>
            <span>test</span>
        </Sidebar>
    )
}
