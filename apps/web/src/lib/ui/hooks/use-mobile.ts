import React from "react"

const MOBILE_BREAKPOINT = 768
const MAX_WIDTH_MQ = globalThis.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

const onMaxWidthChange = (callback: () => void) => {
    const mq = MAX_WIDTH_MQ

    const handleChange = () => callback()

    mq.addEventListener("change", handleChange)
    return () => mq.removeEventListener("change", handleChange)
}

export function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState<boolean>()

    React.useEffect(() => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

        const unsubscribe = onMaxWidthChange(() => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT))
        return unsubscribe
    }, [])

    return !!isMobile
}
