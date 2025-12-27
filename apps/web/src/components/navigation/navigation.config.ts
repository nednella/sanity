import { linkOptions } from "@tanstack/react-router"

const aboutLinks = linkOptions([
    {
        to: "/about",
        title: "About",
        description: "learn more about who we are"
    },
    {
        to: "/requirements",
        title: "Requirements",
        description: "find out what it takes to join our community"
    },
    {
        to: "/diary",
        title: "Achievement Diary",
        description: "for those looking to push themselves beyond the in-game achievements"
    }
])

const memberLinks = linkOptions([
    {
        to: "/",
        title: "Placeholder",
        description: "Placeholder"
    },
    {
        to: "/",
        title: "Placeholder",
        description: "Placeholder"
    },
    {
        to: "/",
        title: "Placeholder",
        description: "Placeholder"
    }
])

export { aboutLinks, memberLinks }
