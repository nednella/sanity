import { linkOptions } from "@tanstack/react-router"

const options = linkOptions([
    {
        label: "About us",
        to: "/about"
    },
    {
        label: "Members",
        to: "/about"
    },
    {
        label: "Authenticated",
        to: "/authenticated"
    }
])

export { options }
