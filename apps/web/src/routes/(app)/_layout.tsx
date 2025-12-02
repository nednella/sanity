import { Outlet, createFileRoute } from "@tanstack/react-router"

import { Content } from "@/components/layout/content"
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
            <Content>
                <Outlet />
            </Content>
        </SidebarProvider>
    )
}
