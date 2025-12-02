import { linkOptions } from "@tanstack/react-router"

const aboutLinks = linkOptions([
    {
        title: "Background",
        to: "/about",
        description: "Learn more about us"
    },
    {
        title: "Requirements",
        to: "/requirements",
        description: "Find out what it takes to join"
    },
    {
        title: "Ranking System",
        to: "/ranks",
        description: "How we progress our members"
    }
])

const memberLinks = linkOptions([
    {
        title: "Placeholder",
        to: "/",
        description: "Placeholder"
    },
    {
        title: "Placeholder",
        to: "/",
        description: "Placeholder"
    },
    {
        title: "Placeholder",
        to: "/",
        description: "Placeholder"
    }
])

export { aboutLinks, memberLinks }
