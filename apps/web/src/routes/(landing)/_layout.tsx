import { Outlet, createFileRoute } from "@tanstack/react-router"

import { Content } from "@/components/content"
import { Navbar } from "@/components/header/navbar"
import { Page } from "@/components/page"

export const Route = createFileRoute("/(landing)")({
    component: PublicLayout
})

function PublicLayout() {
    return (
        <Page>
            <Navbar />
            <Content>
                <Outlet />
            </Content>
        </Page>
    )
}
