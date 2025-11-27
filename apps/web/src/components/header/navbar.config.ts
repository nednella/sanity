import { linkOptions } from "@tanstack/react-router"

const options = linkOptions([
    {
        label: "About us",
        to: "/about"
    },
    {
        label: "Members",
        to: "/"
    },
    {
        label: "Socials",
        to: "/"
    }
])

export { options }
