import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
    component: RouteComponent
})

function RouteComponent() {
    return <h1 className="text-3xl font-bold text-blue-500 underline">Hello world!</h1>
}
