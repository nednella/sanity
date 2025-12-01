import { Outlet, createFileRoute } from "@tanstack/react-router"

import { Content } from "@/components/layout/content"
import { Page } from "@/components/layout/page"
import { Navbar } from "@/components/navigation/navbar"

export const Route = createFileRoute("/(app)")({
    component: AppLayout
})

function AppLayout() {
    return (
        <Page>
            <Navbar />
            <Content>
                <Outlet />
            </Content>
        </Page>
    )
}
