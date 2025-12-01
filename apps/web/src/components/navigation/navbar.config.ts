type NavOption = {
    label: string
    to: string | undefined
    nested: NavOption[] | undefined
}

const options: NavOption[] = [
    {
        label: "About",
        to: undefined,
        nested: [
            {
                label: "Who are we",
                to: "/about",
                nested: undefined
            },
            {
                label: "Requirements",
                to: "/about/requirements",
                nested: undefined
            },
            {
                label: "Ranking system",
                to: "/about/ranks",
                nested: undefined
            }
        ]
    },
    {
        label: "Members",
        to: undefined,
        nested: [
            {
                label: "Placeholder",
                to: "/members",
                nested: undefined
            }
        ]
    },
    {
        label: "Authenticated",
        to: "/authenticated",
        nested: [
            {
                label: "Placeholder",
                to: "/authenticated",
                nested: undefined
            }
        ]
    }
]

export { options }
