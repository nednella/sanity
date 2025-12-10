import { Outlet, createFileRoute } from "@tanstack/react-router"

import { MobileSidebar } from "@/components/navigation/mobile-sidebar"
import { Navbar } from "@/components/navigation/navbar"
import { SidebarProvider } from "@/lib/ui/components/sidebar"

export const Route = createFileRoute("/(app)")({
    component: AppLayout
})

function AppLayout() {
    return (
        <SidebarProvider className="flex-col">
            <Navbar />
            <MobileSidebar />
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </SidebarProvider>
    )
}
