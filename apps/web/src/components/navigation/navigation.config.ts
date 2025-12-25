import { linkOptions } from "@tanstack/react-router"

const aboutLinks = linkOptions([
    {
        title: "About",
        to: "/about",
        description: "learn more about who we are"
    },
    {
        title: "Requirements",
        to: "/requirements",
        description: "find out what it takes to join our community"
    },
    {
        title: "Achievement Diary",
        to: "/diary",
        description: "for those looking to push themselves beyond the in-game achievements"
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
