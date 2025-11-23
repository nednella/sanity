import { useUser } from "@clerk/clerk-react"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(public)/")({
    component: IndexPage
})

function IndexPage() {
    const user = useUser()

    console.log(user)
    return <div className="text-3xl font-bold underline">Hello world!</div>
}
