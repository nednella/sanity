import { Outlet, createFileRoute } from "@tanstack/react-router"

import { Navbar } from "@/components/header/navbar"
import { Content } from "@/components/layout/content"
import { Page } from "@/components/layout/page"

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
