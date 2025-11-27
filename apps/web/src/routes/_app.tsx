import { Outlet, createFileRoute } from "@tanstack/react-router"

import { Content } from "@/components/content"
import { Navbar } from "@/components/header/navbar"
import { Page } from "@/components/page"

export const Route = createFileRoute("/_app")({
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
