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
        description: "Find out what it takes to join us"
    },
    {
        title: "Achievement Diary",
        to: "/achievement-diary",
        description: "Take a look at how we grade content"
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
